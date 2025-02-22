"use server";

import { db } from "@/lib/db";
import {
  bathroomSections,
  kitchenSections,
  mainSections,
  collections,
  collectionSections,
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

export const fetchCollectionById = async (id: number) => {
  console.log('Fetching collection with ID:', id);
  try {
    const collection = await db.query.collections.findFirst({
      where: eq(collections.id, id),
      with: {
        sections: {
          orderBy: asc(collectionSections.order),
        },
      },
    });

    if (!collection) {
      console.warn(`Collection with ID ${id} not found in database`);
      return null;
    }

    console.log('Found collection:', collection);
    return collection;
  } catch (error) {
    console.error('Error in fetchCollectionById:', error);
    return null;
  }
};

// export const fetchCollectionById = async (id: number): Promise<CollectionWithSections | null> => {
//   try {
//     const collection = await db.query.collections.findFirst({
//       where: (collections, { eq }) => eq(collections.id, id),
//       with: {
//         sections: {
//           orderBy: (sections, { asc }) => [asc(sections.order)],
//         },
//       },
//     });

//     return collection || null;
//   } catch (error) {
//     console.error('Error fetching collection:', error);
//     return null;
//   }
// };

// ============================================================================
// Page Fetchers
// ============================================================================

/**
 * Fetches all sections for the main page
 */
export const fetchMainPage = async () => {
  console.log('Fetching main page data...');

  try {
    // Сначала получим все секции для отладки
    const allSections = await db.query.mainSections.findMany();
    console.log('All main sections:', allSections);

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

    console.log('Main Page Data:', {
      intro: {
        hasMainImage: !!sections.intro?.mainImage,
        hasImageBlock: sections.intro?.imageBlockSrcs?.length,
      },
      banner: {
        hasMainImage: !!sections.banner?.mainImage,
        hasImageBlock: sections.banner?.imageBlockSrcs?.length,
      },
      feature: {
        hasMainImage: !!sections.feature?.mainImage,
        hasImageBlock: sections.feature?.imageBlockSrcs?.length,
      },
      collections: {
        hasMainImage: !!sections.collections?.mainImage,
        hasImageBlock: sections.collections?.imageBlockSrcs?.length,
      },
      showcase: {
        hasMainImage: !!sections.showcase?.mainImage,
        hasImageBlock: sections.showcase?.imageBlockSrcs?.length,
      },
    });

    return sections;
  } catch (error) {
    console.error('Error fetching main page:', error);
    throw error;
  }
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
  console.log('Fetching bathroom page data...');

  try {
    // Сначала получим все секции для отладки
    const allSections = await db.query.bathroomSections.findMany();
    console.log('All bathroom sections:', allSections);

    const data = {
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

    console.log('Bathroom Page Data:', {
      banner: {
        hasImage: !!data.banner?.image,
        title: data.banner?.title,
        section: data.banner?.section,
      },
      sections: data.sections.map(s => ({
        id: s.id,
        title: s.title,
        section: s.section,
        imagesCount: s.images?.length,
      })),
      collections: data.collections.map(c => ({
        id: c.id,
        title: c.title,
        section: c.section,
        imagesCount: c.images?.length,
      })),
    });

    return data;
  } catch (error) {
    console.error('Error fetching bathroom page:', error);
    throw error;
  }
};

/**
 * Fetches content for the kitchen page, organized by section type
 */
export const fetchKitchenPage = async () => {
  console.log('Fetching kitchen page data...');

  try {
    const data = {
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

    // Добавляем детальное логирование
    console.log('Kitchen Page Data:', {
      hasBanner: !!data.banner,
      bannerData: data.banner,
      sectionsCount: data.sections.length,
      collectionsCount: data.collections.length
    });

    return data;
  } catch (error) {
    console.error('Error fetching kitchen page:', error);
    throw error;
  }
};
