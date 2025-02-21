"use server";

import { db } from "@/lib/db";
import {
  bathroomSections,
  kitchenSections,
  mainSections,
  type CollectionWithSections,
  type ImageSlide,
} from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

// ============================================================================
// Basic Fetchers
// ============================================================================

/**
 * Fetches all categories with their subcategories
 */
export const fetchCategories = async () => {
  return db.query.categories.findMany({
    with: {
      subCategories: true,
    },
  });
};

/**
 * Fetches all image slides
 */
export const fetchSlides = async (): Promise<ImageSlide[]> => {
  return db.query.imageSlides.findMany();
};

/**
 * Fetches all collection previews
 */
export const fetchCollections = async () => {
  return db.query.collectionPreviews.findMany();
};

/**
 * Fetches a specific collection by name with its sections
 */
export const fetchCollectionByName = async (name: string): Promise<CollectionWithSections | undefined> => {
  return db.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.name, name),
    with: {
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.order)],
      },
    },
  });
};
export const fetchCollectionById = async (id: number): Promise<CollectionWithSections | undefined> => {
  return db.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.id, id),
    with: {
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.order)],
      },
    },
  });
};

// ============================================================================
// Page Fetchers
// ============================================================================

/**
 * Fetches all sections for the main page
 */
export const fetchMainPage = async () => {
  const sections = {
    intro: await db.query.mainSections.findFirst({
      where: eq(mainSections.section, "intro"),
    }),
    banner: await db.query.mainSections.findFirst({
      where: eq(mainSections.section, "banner"),
    }),
    feature: await db.query.mainSections.findFirst({
      where: eq(mainSections.section, "feature"),
    }),
    collections: await db.query.mainSections.findFirst({
      where: eq(mainSections.section, "collections"),
    }),
    showcase: await db.query.mainSections.findFirst({
      where: eq(mainSections.section, "showcase"),
    }),
  };

  return sections;
};

/**
 * Fetches content for the about page
 */
export const fetchAboutPage = async () => {
  return db.query.aboutPage.findFirst();
};

/**
 * Fetches content for the bathroom page, organized by section type
 */
export const fetchBathroomPage = async () => {
  return {
    banner: await db.query.bathroomSections.findFirst({
      where: eq(bathroomSections.section, "banner"),
    }),
    sections: await db.query.bathroomSections.findMany({
      where: eq(bathroomSections.section, "section"),
      orderBy: asc(bathroomSections.order),
    }),
    collections: await db.query.bathroomSections.findMany({
      where: eq(bathroomSections.section, "collection"),
      orderBy: asc(bathroomSections.order),
    }),
  };
};

/**
 * Fetches content for the kitchen page, organized by section type
 */
export const fetchKitchenPage = async () => {
  return {
    banner: await db.query.kitchenSections.findFirst({
      where: eq(kitchenSections.section, "banner"),
    }),
    sections: await db.query.kitchenSections.findMany({
      where: eq(kitchenSections.section, "section"),
      orderBy: asc(kitchenSections.order),
    }),
    collections: await db.query.kitchenSections.findMany({
      where: eq(kitchenSections.section, "collection"),
      orderBy: asc(kitchenSections.order),
    }),
  };
};
