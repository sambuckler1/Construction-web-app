import {
  galleries,
  images,
  type GalleryKey,
  type ImageKey,
  type OptimizedImage,
} from "@/lib/image-manifest";

export type Project = {
  /** Multi-image slideshow folder key. */
  gallery?: GalleryKey;
  /** Single image key (used when there's no slideshow). */
  imageKey?: ImageKey;
  location: string;
  title: string;
  description: string;
  details: string;
};

/** All images for a project, in slideshow order (cover first). */
export function projectImages(project: Project): readonly OptimizedImage[] {
  if (project.gallery) return galleries[project.gallery];
  if (project.imageKey) return [images[project.imageKey]];
  return [];
}

/** The cover image for a project (first slide). */
export function projectCover(project: Project): OptimizedImage | undefined {
  return projectImages(project)[0];
}

/** Stable identity for React keys / anchors. */
export function projectKey(project: Project): string {
  return project.gallery ?? project.imageKey ?? project.title;
}

/** Builds shown as a single captioned tile in the grid below the features. */
export type GalleryExtra = {
  gallery?: GalleryKey;
  imageKey?: ImageKey;
  title: string;
};

/** Cover image for a captioned grid tile. */
export function extraCover(extra: GalleryExtra): OptimizedImage | undefined {
  if (extra.gallery) return galleries[extra.gallery][0];
  if (extra.imageKey) return images[extra.imageKey];
  return undefined;
}

/** Stable identity for React keys. */
export function extraKey(extra: GalleryExtra): string {
  return extra.gallery ?? extra.imageKey ?? extra.title;
}

export const galleryExtras: GalleryExtra[] = [
  { gallery: "diego-garage-steps", title: "Interior Red Oak Staircase" },
  { imageKey: "project8", title: "Modern Front Entrance" },
  { imageKey: "project9", title: "Cedar Fence with Automated Gate" },
  { gallery: "tracie-porch", title: "Composite Front Porch" },
  { imageKey: "misc-1", title: "Pressure Treated Deck" },
  { imageKey: "misc-2", title: "Trex Toasted Sand with White Composite Rails" },
  {
    imageKey: "misc-3",
    title: "Trex Foggy Wharf with Cable Rails and Trex Cocktail Rail",
  },
  {
    imageKey: "misc-4",
    title: "Trex Toasted Sand with Cable Rails and Trex Cocktail Rail",
  },
  {
    imageKey: "misc-5",
    title: "Trex Foggy Wharf with Recessed LED Lighting through Trex Fascia",
  },
  { imageKey: "misc-6", title: "Pressure Treated Deck" },
  { imageKey: "misc-7", title: "Cedar Skirting" },
  {
    imageKey: "misc-8",
    title: "Pine Rail Repair with Custom Milled Balusters",
  },
];

export const projects: Project[] = [
  {
    gallery: "mark-deck",
    location: "Woodstock, NY",
    title: "Black Locust Hardwood Deck with Cable Rails",
    description:
      "The client's goal was a timeless, natural hardwood deck with clean sightlines and long-term durability. We built this deck using Black Locust hardwood paired with Cable Bullet cable railing for a seamless, modern look.",
    details:
      "Spanning over half a mile of decking, this project featured wide hardwood cocktail rails, minimalist cable splitters, integrated LED lighting, full picture framing, and a complete hidden fastener system—resulting in a refined, high-end finish that will age beautifully over time.",
  },
  {
    gallery: "jackson-deck",
    location: "Kingston, NY",
    title: "Composite Deck Rebuild with Diagonal Board Design",
    description:
      "This homeowner wanted to completely replace a poorly installed composite deck and make the new space feel truly custom. Rather than replicating the original layout, we introduced a diagonal board pattern to highlight craftsmanship and elevate the overall design.",
    details:
      "Built with TimberTech composite decking, fully picture-framed, and paired with composite railings featuring black balusters for a nearly invisible look, this deck is entirely maintenance-free. Materials include TimberTech Coconut Husk decking, Trex composite railings, and Trex white PVC fascia.",
  },
  {
    gallery: "craig-deck",
    location: "Woodstock, NY",
    title: "Trex Enhance Deck Upgrade with Modern Cable Rail",
    description:
      "With a solid existing frame in place, this project focused on upgrading the deck surface and railings for a fresh, modern look. We installed Trex Foggy Wharf decking from the Enhance Naturals line for a durable, low-maintenance finish.",
    details:
      "To complement the design, cable railing was installed through black-stained wood posts and capped with a Trex cocktail rail, preventing water damage while providing a functional and elegant top rail. Finished with Trex white PVC fascia throughout.",
  },
  {
    gallery: "adah-deck",
    location: "Woodstock, NY",
    title: "Woodstock-Inspired Composite Deck with Wood Handrails",
    description:
      "The client wanted the low maintenance benefits of composite decking while preserving a classic Woodstock aesthetic. We achieved this balance by pairing Trex Enhance Naturals decking in Rocky Harbor with pressure-treated pine handrails and sleek cable railing.",
    details:
      "The result is a deck that feels warm and natural while maintaining clean lines and long-term durability, finished with Trex white PVC fascia for a polished look.",
  },
  {
    gallery: "alan-deck",
    location: "Woodstock, NY",
    title: "Multi-Level Composite Deck with Pool Integration",
    description:
      "This large-scale rebuild included over 1,200 square feet of decking, two levels, three staircases, and precise cuts to accommodate an above-ground pool.",
    details:
      "Constructed with TimberTech Coconut Husk decking, cable railings stained to match the boards, and a TimberTech cocktail rail, this project required careful planning and execution. The finished deck offers durability, safety, and timeless style built to last for years.",
  },
  {
    gallery: "diego-deck",
    location: "Kingston, NY",
    title: "Hot Tub–Ready Elevated Composite Deck",
    description:
      "Designed to safely support a hot tub, this elevated deck required substantial structural framing and specialized equipment to position the tub atop the 8-foot-high, 350-square-foot platform.",
    details:
      "We used Trex Clam Shell decking paired with hog wire railings to deliver a low-maintenance solution that balances strength, safety, and visual appeal without sacrificing openness.",
  },
];
