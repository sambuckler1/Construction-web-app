// One-time image optimization pipeline.
//
// Reads the curated source photos (large originals in public/deck_images and
// public/), resizes + compresses them to WebP in public/images/, and writes a
// typed manifest at src/lib/image-manifest.ts containing each image's final
// dimensions and a tiny base64 blur placeholder for next/image.
//
// Run with: npm run optimize-images

import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images");
const manifestPath = path.join(root, "src", "lib", "image-manifest.ts");

const MAX_WIDTH = 2400;
const QUALITY = 78;

// key -> source file (relative to repo root). Keys become the manifest entries
// and the output filenames (public/images/<key>.webp).
const sources = {
  "hero-zoom-close": "public/images/hero-animation/hero-1.JPG",
  "hero-zoom-wide": "public/images/hero-animation/hero-2.JPG",
  "construction-hero": "public/deck_images/hero2.png",
  "construction-hero-alt": "public/deck_images/IMG_6267 2.jpeg",
  "gallery-hero": "public/deck_images/IMG_6234.jpeg",
  "dumpster-hero": "public/IMG_9800.jpg",
  "dumpster-1": "public/IMG_9801 2.jpg",
  "dumpster-2": "public/IMG_9802 2.jpg",
  // project1-7 and project10 now live as multi-image galleries (see below).
  // project8/9 remain single images; their originals were cleaned, so their
  // existing manifest entries (public/images/project8|9.webp) are preserved.
  project8: "public/deck_images/project8.png",
  project9: "public/deck_images/project9.png",
  "misc-1": "public/images/deck-misc/misc-1.JPG",
  "misc-2": "public/images/deck-misc/misc-2.JPG",
  "misc-3": "public/images/deck-misc/misc-3.JPG",
  "misc-4": "public/images/deck-misc/misc-4.JPG",
  "misc-5": "public/images/deck-misc/misc-5.JPG",
  "misc-6": "public/images/deck-misc/misc-6.JPG",
  "misc-7": "public/images/deck-misc/misc-7.JPG",
  "misc-8": "public/images/deck-misc/misc-8.JPG",
  "framing-hero": "public/images/deck-framing/IMG_1478.JPG",
};

// Gallery key -> folder of source photos (relative to repo root). Every image
// in the folder is optimized into public/images/<key>/slide-<i>.webp, in order.
// A file named project*.webp (the previously curated hero) is placed first.
const galleries = {
  "mark-deck": "public/images/mark-deck",
  "jackson-deck": "public/images/jackson-deck",
  "craig-deck": "public/images/craig-deck",
  "adah-deck": "public/images/adah-deck",
  "alan-deck": "public/images/alan-deck",
  "diego-deck": "public/images/diego-deck",
  "diego-garage-steps": "public/images/diego-garage-steps",
  "tracie-porch": "public/images/tracie-porch",
  "deck-framing": "public/images/deck-framing",
};

// key -> extra clockwise rotation in degrees, applied after EXIF orientation.
// Use negative values for counter-clockwise.
const extraRotation = {
  "hero-zoom-wide": -90,
};

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"]);
const isGeneratedSlide = (name) => /^slide-\d+\.webp$/i.test(name);

// sharp's bundled libheif chokes on some iPhone HEICs ("bad seek"). On macOS,
// sips reliably transcodes HEIC/HEIF to JPEG, which sharp then handles.
function readImageBuffer(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".heic" && ext !== ".heif") return readFile(filePath);

  const tmp = path.join(tmpdir(), `heic-${randomUUID()}.jpg`);
  try {
    execFileSync("sips", ["-s", "format", "jpeg", filePath, "--out", tmp], {
      stdio: "ignore",
    });
    return readFile(tmp).finally(() => rm(tmp, { force: true }));
  } catch (err) {
    rm(tmp, { force: true });
    throw err;
  }
}

// Optimize one image buffer into a main WebP + a tiny base64 blur placeholder.
async function optimize(input, extraDeg = 0) {
  const pipeline = sharp(input).rotate();
  if (extraDeg) pipeline.rotate(extraDeg);
  pipeline
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY });
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  const blurPipeline = sharp(input).rotate();
  if (extraDeg) blurPipeline.rotate(extraDeg);
  const blurBuf = await blurPipeline
    .resize({ width: 20 })
    .webp({ quality: 40 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  return { data, info, blurDataURL };
}

// Order gallery files: the curated project*.webp hero first, then the rest
// case-insensitively alphabetical for a stable, predictable slideshow order.
function orderGalleryFiles(files) {
  const rank = (f) => (/^project\d+\.webp$/i.test(f) ? 0 : 1);
  return [...files].sort((a, b) => {
    const r = rank(a) - rank(b);
    return r !== 0 ? r : a.toLowerCase().localeCompare(b.toLowerCase());
  });
}

// Optimize every image in each gallery folder into slide-<i>.webp and return
// a manifest: { [key]: OptimizedImage[] }.
async function buildGalleries() {
  const galleryManifest = {};
  let before = 0;
  let after = 0;

  for (const [key, relDir] of Object.entries(galleries)) {
    const dir = path.join(root, relDir);
    if (!existsSync(dir)) {
      console.warn(`SKIP gallery ${key}: missing folder ${relDir}`);
      continue;
    }

    const all = await readdir(dir);
    const sources = orderGalleryFiles(
      all.filter(
        (f) =>
          IMAGE_EXT.has(path.extname(f).toLowerCase()) && !isGeneratedSlide(f)
      )
    );

    if (sources.length === 0) {
      console.warn(`SKIP gallery ${key}: no source images in ${relDir}`);
      continue;
    }

    // Remove previously generated slides so re-runs don't leave orphans.
    await Promise.all(
      all
        .filter(isGeneratedSlide)
        .map((f) => rm(path.join(dir, f), { force: true }))
    );

    const slides = [];
    for (let i = 0; i < sources.length; i++) {
      try {
        const input = await readImageBuffer(path.join(dir, sources[i]));
        const { data, info, blurDataURL } = await optimize(input);
        const outName = `slide-${i}.webp`;
        await writeFile(path.join(dir, outName), data);
        before += input.length;
        after += data.length;
        slides.push({
          src: `/${relDir.replace(/^public\//, "")}/${outName}`,
          width: info.width,
          height: info.height,
          blurDataURL,
        });
      } catch (err) {
        console.warn(
          `FAIL  ${key}/${sources[i]} (${err.message.split("\n")[0]})`
        );
      }
    }

    galleryManifest[key] = slides;
    const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
    console.log(
      `GAL   ${key.padEnd(20)} ${slides.length} slides  ${kb(before)} -> ${kb(
        after
      )}`
    );
  }

  return galleryManifest;
}

// Load the previously generated manifest so we can preserve entries whose
// large source photos were removed (e.g. after a --clean run). Keys are
// double-quoted strings, so the object literal is valid JSON we can extract.
async function loadExistingManifest() {
  if (!existsSync(manifestPath)) return {};
  try {
    const text = await readFile(manifestPath, "utf8");
    const match = text.match(
      /export const images = (\{[\s\S]*?\}) as const satisfies/
    );
    if (!match) return {};
    return JSON.parse(match[1]);
  } catch (err) {
    console.warn(`WARN  could not parse existing manifest: ${err.message}`);
    return {};
  }
}

async function run() {
  await mkdir(outDir, { recursive: true });

  const existing = await loadExistingManifest();
  const manifest = {};
  let totalBefore = 0;
  let totalAfter = 0;

  for (const [key, relSource] of Object.entries(sources)) {
    const sourcePath = path.join(root, relSource);
    if (!existsSync(sourcePath)) {
      if (existing[key]) {
        manifest[key] = existing[key];
        console.log(`KEEP  ${key}: source missing, preserved existing entry`);
      } else {
        console.warn(`SKIP  ${key}: missing source ${relSource}`);
      }
      continue;
    }

    const input = await readFile(sourcePath);
    const extraDeg = extraRotation[key] ?? 0;

    try {
      const { data, info, blurDataURL } = await optimize(input, extraDeg);
      const outFile = path.join(outDir, `${key}.webp`);
      await writeFile(outFile, data);
      totalBefore += input.length;
      totalAfter += data.length;

      manifest[key] = {
        src: `/images/${key}.webp`,
        width: info.width,
        height: info.height,
        blurDataURL,
      };

      const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
      console.log(
        `OK    ${key.padEnd(20)} ${kb(input.length).padStart(8)} -> ${kb(
          data.length
        ).padStart(7)}  (${info.width}x${info.height})`
      );
    } catch (err) {
      console.warn(`FAIL  ${key}: ${relSource} (${err.message.split("\n")[0]})`);
    }
  }

  const galleryManifest = await buildGalleries();

  const header = `// AUTO-GENERATED by scripts/optimize-images.mjs. Do not edit by hand.
// Run \`npm run optimize-images\` to regenerate.

export type OptimizedImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const images = ${JSON.stringify(manifest, null, 2)} as const satisfies Record<string, OptimizedImage>;

export type ImageKey = keyof typeof images;

export const galleries = ${JSON.stringify(galleryManifest, null, 2)} as const satisfies Record<string, readonly OptimizedImage[]>;

export type GalleryKey = keyof typeof galleries;
`;

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, header);

  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;
  console.log(
    `\nDone. ${Object.keys(manifest).length} images, ${
      Object.keys(galleryManifest).length
    } galleries. ${mb(totalBefore)} -> ${mb(totalAfter)}`
  );
}

// Optional: pass --clean to remove the large source directories after a
// successful run (public/deck_images and the stray dumpster originals).
async function clean() {
  const targets = [
    "public/deck_images",
    "public/IMG_9800.jpg",
    "public/IMG_9801 2.jpg",
    "public/IMG_9802 2.jpg",
  ];
  for (const t of targets) {
    const p = path.join(root, t);
    if (existsSync(p)) {
      await rm(p, { recursive: true, force: true });
      console.log(`removed ${t}`);
    }
  }
}

await run();
if (process.argv.includes("--clean")) {
  await clean();
}
