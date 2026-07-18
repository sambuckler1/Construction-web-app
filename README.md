# Woodstock Renewal Contracting

Marketing site for Woodstock Renewal Contracting — a dark, editorial, photography-first
Next.js app with two offerings: **Construction** (landing + gallery) and **Dumpster
Rentals**. Lead capture runs through [Resend](https://resend.com).

## Stack

- **Next.js 16** (App Router, React Server Components) + **TypeScript**
- **Tailwind CSS v4** with a dark-only editorial theme (`src/app/globals.css`)
- **react-hook-form** for the inquiry / appointment / contact forms
- **Resend** for transactional email (API routes under `src/app/api/*`)
- **sharp** for the one-time image optimization pipeline

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `RESEND_API_KEY` in `.env.local` for form submissions to send email.

## Routes

| Route                | Description                                        |
| -------------------- | -------------------------------------------------- |
| `/`                  | Construction landing (hero, services, inquiry form) |
| `/gallery`           | Full project gallery (case studies)                |
| `/dumpster-rentals`  | Dumpster rental landing (schedule + contact forms) |
| `/api/construction`  | Sends construction inquiries via Resend            |
| `/api/appointment`   | Sends dumpster appointment requests via Resend     |
| `/api/contact`       | Sends contact messages via Resend                  |

## Images

All photography is served from `public/images/` as compressed WebP and rendered with
`next/image` (responsive AVIF/WebP + blur placeholders). Do **not** commit large
originals — run them through the pipeline instead.

### Adding or updating photos

1. Drop the source photo(s) somewhere in the repo (e.g. a temporary `public/_raw/` folder).
2. Add an entry to the `sources` map in `scripts/optimize-images.mjs`:
   `"<key>": "public/_raw/your-photo.jpg"`.
3. Run the pipeline:

   ```bash
   npm run optimize-images
   ```

   This writes `public/images/<key>.webp` and regenerates
   `src/lib/image-manifest.ts` (dimensions + blur placeholder).

4. Reference the image by its key from the manifest, e.g. `images["<key>"]`.
5. Delete the raw source so it never ships in the build.

> Note: some iPhone exports are HEIF-encoded even with a `.jpg`/`.png` extension. If a
> file fails to convert, re-export it as a standard JPEG/PNG first.

## Build

```bash
npm run build
npm run start
```
