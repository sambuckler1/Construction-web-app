"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import BasementScene from "../../basement-showcase/BasementScene";

// Define your private proposal slugs here
// Add new proposals by adding entries to this object
const VALID_PROPOSALS: Record<string, { title: string; client: string }> = {
  "sean-bsmt-xK9m": {
    title: "Basement Renovation Proposal",
    client: "Sean",
  },
  // Add more proposals here as needed:
  // "client-name-randomstring": { title: "Project Title", client: "Client Name" },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProposalPage({ params }: PageProps) {
  const { slug } = use(params);
  
  // Check if this is a valid proposal slug
  const proposal = VALID_PROPOSALS[slug];
  
  if (!proposal) {
    notFound();
  }

  // For now, all valid slugs show the basement scene
  // In the future, you could have different components for different proposal types
  return <BasementScene />;
}

