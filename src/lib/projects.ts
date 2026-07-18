import type { ImageKey } from "@/lib/image-manifest";

export type Project = {
  imageKey: ImageKey;
  location: string;
  title: string;
  description: string;
  details: string;
};

export const projects: Project[] = [
  {
    imageKey: "project1",
    location: "Woodstock, NY",
    title: "Black Locust Hardwood Deck with Cable Rails",
    description:
      "The client's goal was a timeless, natural hardwood deck with clean sightlines and long-term durability. We built this deck using Black Locust hardwood paired with Cable Bullet cable railing for a seamless, modern look.",
    details:
      "Spanning over half a mile of decking, this project featured wide hardwood cocktail rails, minimalist cable splitters, integrated LED lighting, full picture framing, and a complete hidden fastener system—resulting in a refined, high-end finish that will age beautifully over time.",
  },
  {
    imageKey: "project2",
    location: "Kingston, NY",
    title: "Composite Deck Rebuild with Diagonal Board Design",
    description:
      "This homeowner wanted to completely replace a poorly installed composite deck and make the new space feel truly custom. Rather than replicating the original layout, we introduced a diagonal board pattern to highlight craftsmanship and elevate the overall design.",
    details:
      "Built with TimberTech composite decking, fully picture-framed, and paired with composite railings featuring black balusters for a nearly invisible look, this deck is entirely maintenance-free. Materials include TimberTech Coconut Husk decking, Trex composite railings, and Trex white PVC fascia.",
  },
  {
    imageKey: "project3",
    location: "Woodstock, NY",
    title: "Trex Enhance Deck Upgrade with Modern Cable Rail",
    description:
      "With a solid existing frame in place, this project focused on upgrading the deck surface and railings for a fresh, modern look. We installed Trex Foggy Wharf decking from the Enhance Naturals line for a durable, low-maintenance finish.",
    details:
      "To complement the design, cable railing was installed through black-stained wood posts and capped with a Trex cocktail rail, preventing water damage while providing a functional and elegant top rail. Finished with Trex white PVC fascia throughout.",
  },
  {
    imageKey: "project4",
    location: "Woodstock, NY",
    title: "Woodstock-Inspired Composite Deck with Wood Handrails",
    description:
      "The client wanted the low maintenance benefits of composite decking while preserving a classic Woodstock aesthetic. We achieved this balance by pairing Trex Enhance Naturals decking in Rocky Harbor with pressure-treated pine handrails and sleek cable railing.",
    details:
      "The result is a deck that feels warm and natural while maintaining clean lines and long-term durability, finished with Trex white PVC fascia for a polished look.",
  },
  {
    imageKey: "project5",
    location: "Woodstock, NY",
    title: "Multi-Level Composite Deck with Pool Integration",
    description:
      "This large-scale rebuild included over 1,200 square feet of decking, two levels, three staircases, and precise cuts to accommodate an above-ground pool.",
    details:
      "Constructed with TimberTech Coconut Husk decking, cable railings stained to match the boards, and a TimberTech cocktail rail, this project required careful planning and execution. The finished deck offers durability, safety, and timeless style built to last for years.",
  },
  {
    imageKey: "project6",
    location: "Kingston, NY",
    title: "Hot Tub–Ready Elevated Composite Deck",
    description:
      "Designed to safely support a hot tub, this elevated deck required substantial structural framing and specialized equipment to position the tub atop the 8-foot-high, 350-square-foot platform.",
    details:
      "We used Trex Clam Shell decking paired with hog wire railings to deliver a low-maintenance solution that balances strength, safety, and visual appeal without sacrificing openness.",
  },
  {
    imageKey: "project7",
    location: "Kingston, NY",
    title: "Custom Interior Red Oak Staircase with Cable Rail",
    description:
      "This interior staircase was all about precision and detail. Built from red oak and finished with Cable Bullet cable railing, the staircase serves as both a functional structure and a design statement.",
    details:
      "The clean lines and quality materials transform a simple stairway into a welcoming architectural feature the homeowner enjoys every day.",
  },
  {
    imageKey: "project8",
    location: "Kingston, NY",
    title: "Modern Front Entrance with Aluminum Cable Rail",
    description:
      "The goal for this project was to create a clean, modern entrance that elevated the home's curb appeal. We replaced outdated columns with sleek black columns and installed aluminum Cable Bullet railings for a refined, contemporary look.",
    details:
      "The deck surface and fascia were completed with Trex Clam Shell decking and matching fascia, tying the entire entrance together with a cohesive, low-maintenance finish.",
  },
  {
    imageKey: "project9",
    location: "Woodstock, NY",
    title: "Custom Cedar Fence with Automated Driveway Gate",
    description:
      "This custom fence was designed to provide security while maintaining an open, natural feel. Built from natural cedar logs with one-inch cedar rails and backed by discreet black netting, the fence allows the homeowner's dog to safely enjoy the front yard.",
    details:
      "An automated driveway gate completes the enclosure, offering peace of mind without compromising aesthetics.",
  },
  {
    imageKey: "project10",
    location: "Newburgh, NY",
    title: "Front Porch Composite Replacement",
    description:
      "No project is too small to do right. This homeowner needed to replace a poorly installed wooden front porch originally built by their homebuilder.",
    details:
      "We removed the existing structure and installed a maintenance-free Trex Toasted Sand front porch, complete with Trex composite railings and Trex white PVC fascia. The result is a clean, durable, and professional finish that significantly improves both appearance and longevity.",
  },
];
