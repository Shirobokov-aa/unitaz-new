"use server"

import { db } from "@/lib/db";
import {
  aboutPage,
  AboutPage,
  BathroomSection,
  bathroomSections,
  categories,
  CategoryWithSubCategories,
  ImageSlide,
  imageSlides,
  InsertCategory,
  InsertSubCategory,
  KitchenSection,
  kitchenSections,
  MainSection,
  mainSections,
  subCategories,
  collectionPreviews, // Добавьте этот импорт
  CollectionPreview, // И этот
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Добавьте новую функцию здесь, перед saveCategories
export async function saveCollectionPreviews(previews: CollectionPreview[]) {
  try {
    await db.transaction(async (tx) => {
      // Получаем все существующие ID
      const existingPreviews = await tx.select({ id: collectionPreviews.id }).from(collectionPreviews);
      const existingIds = new Set(existingPreviews.map((preview) => preview.id));

      for (const preview of previews) {
        if (existingIds.has(preview.id)) {
          // Обновляем существующее превью
          await tx
            .update(collectionPreviews)
            .set({
              image: preview.image,
              title: preview.title,
              desc: preview.desc,
              link: preview.link,
              flexDirection: preview.flexDirection,
            })
            .where(eq(collectionPreviews.id, preview.id));
          existingIds.delete(preview.id);
        } else {
          // Добавляем новое превью без id
          await tx.insert(collectionPreviews).values({
            image: preview.image,
            title: preview.title,
            desc: preview.desc,
            link: preview.link,
            flexDirection: preview.flexDirection,
          });
        }
      }

      // Удаляем превью, которых больше нет в списке
      for (const id of existingIds) {
        await tx.delete(collectionPreviews).where(eq(collectionPreviews.id, id));
      }
    });

    return { success: true, message: "Превью коллекций сохранены успешно" };
  } catch (error) {
    console.error("Ошибка сохранения превью коллекций:", error);
    return { success: false, message: "Не удалось сохранить превью коллекций" };
  }
}

export async function saveCategories(data: CategoryWithSubCategories[]) {
  try {
    await db.transaction(async (tx) => {
      for (const category of data) {
        let categoryId: number;

        if (category.id) {
          // Update existing category
          await tx
            .update(categories)
            .set({ name: category.name, images: category.images })
            .where(eq(categories.id, category.id));
          categoryId = category.id;
        } else {
          // Insert new category
          const newCategory: InsertCategory = {
            name: category.name,
            images: category.images,
          };
          const [insertedCategory] = await tx.insert(categories).values(newCategory).returning({ id: categories.id });
          categoryId = insertedCategory.id;
        }

        // Handle subcategories
        for (const subCategory of category.subCategories) {
          if (subCategory.id) {
            // Update existing subcategory
            await tx
              .update(subCategories)
              .set({ name: subCategory.name, href: subCategory.href })
              .where(eq(subCategories.id, subCategory.id));
          } else {
            // Insert new subcategory
            const newSubCategory: InsertSubCategory = {
              name: subCategory.name,
              href: subCategory.href,
            };
            await tx.insert(subCategories).values({ ...newSubCategory, categoryId: categoryId });
          }
        }
      }
    });

    return { success: true, message: "Categories and subcategories saved successfully" };
  } catch (error) {
    console.error("Error saving categories:", error);
    return { success: false, message: "Failed to save categories and subcategories" };
  }
}

export async function saveImageSlides(slides: ImageSlide[]) {
  try {
    await db.transaction(async (tx) => {
      // Get all existing slide IDs
      const existingSlides = await tx.select({ id: imageSlides.id }).from(imageSlides);
      const existingIds = new Set(existingSlides.map((slide) => slide.id));

      for (const slide of slides) {
        if (existingIds.has(slide.id)) {
          // Update existing slide
          await tx
            .update(imageSlides)
            .set({
              desktopImage: slide.desktopImage,
              mobileImage: slide.mobileImage,
              title: slide.title,
            })
            .where(eq(imageSlides.id, slide.id));
          existingIds.delete(slide.id);
        } else {
          // Insert new slide
          await tx.insert(imageSlides).values({
            desktopImage: slide.desktopImage,
            mobileImage: slide.mobileImage,
            title: slide.title,
          });
        }
      }

      // Delete slides that are no longer present
      for (const id of existingIds) {
        await tx.delete(imageSlides).where(eq(imageSlides.id, id));
      }
    });

    return { success: true, message: "Image slides saved successfully" };
  } catch (error) {
    console.error("Error saving image slides:", error);
    return { success: false, message: "Failed to save image slides" };
  }
}

export async function saveMainSections(sections: MainSection[]) {
  try {
    await db.transaction(async (tx) => {
      for (const section of sections) {
        if (section.id) {
          // Update existing section
          await tx
            .update(mainSections)
            .set({
              title: section.title,
              description: section.description,
              linkName: section.linkName,
              linkUrl: section.linkUrl,
              mainImage: section.mainImage,
              imageBlockSrcs: section.imageBlockSrcs,
              imageBlockAlts: section.imageBlockAlts,
              imageBlockDescs: section.imageBlockDescs,
              order: section.order,
              updatedAt: new Date(),
            })
            .where(eq(mainSections.id, section.id));
        } else {
          // Insert new section
          await tx.insert(mainSections).values({
            section: section.section,
            title: section.title,
            description: section.description,
            linkName: section.linkName,
            linkUrl: section.linkUrl,
            mainImage: section.mainImage,
            imageBlockSrcs: section.imageBlockSrcs,
            imageBlockAlts: section.imageBlockAlts,
            imageBlockDescs: section.imageBlockDescs,
            order: section.order,
          });
        }
      }
    });

    return { success: true, message: "Main sections saved successfully" };
  } catch (error) {
    console.error("Error saving main sections:", error);
    return { success: false, message: "Failed to save main sections" };
  }
}

export async function saveAboutPage(data: AboutPage) {
  try {
    const existingPage = await db.query.aboutPage.findFirst();

    if (existingPage) {
      // Update existing entry
      await db
        .update(aboutPage)
        .set({
          bannerName: data.bannerName,
          bannerImage: data.bannerImage,
          bannerTitle: data.bannerTitle,
          bannerDescription: data.bannerDescription,
          bannerLink: data.bannerLink,
          sections: data.sections,
        })
        .where(eq(aboutPage.id, existingPage.id));
    } else {
      // Insert new entry
      await db.insert(aboutPage).values({
        bannerName: data.bannerName,
        bannerImage: data.bannerImage,
        bannerTitle: data.bannerTitle,
        bannerDescription: data.bannerDescription,
        bannerLink: data.bannerLink,
        sections: data.sections,
      });
    }

    return { success: true, message: "About page saved successfully" };
  } catch (error) {
    console.error("Error saving about page:", error);
    return { success: false, message: "Failed to save about page" };
  }
}

export async function saveBathroomSections(sections: BathroomSection[]) {
  try {
    await db.transaction(async (tx) => {
      // Get all existing section IDs
      const existingSections = await tx.select({ id: bathroomSections.id }).from(bathroomSections);
      const existingIds = new Set(existingSections.map((section) => section.id));

      for (const section of sections) {
        if (existingIds.has(section.id)) {
          // Update existing section
          await tx
            .update(bathroomSections)
            .set({
              section: section.section,
              title: section.title,
              description: section.description,
              name: section.name,
              image: section.image,
              images: section.images,
              linkText: section.linkText,
              linkUrl: section.linkUrl,
              order: section.order,
              updatedAt: new Date(),
            })
            .where(eq(bathroomSections.id, section.id));
          existingIds.delete(section.id);
        } else {
          // Insert new section
          await tx.insert(bathroomSections).values({
            section: section.section,
            title: section.title,
            description: section.description,
            name: section.name,
            image: section.image,
            images: section.images,
            linkText: section.linkText,
            linkUrl: section.linkUrl,
            order: section.order,
          });
        }
      }

      // Delete sections that are no longer present
      for (const id of existingIds) {
        await tx.delete(bathroomSections).where(eq(bathroomSections.id, id));
      }
    });

    return { success: true, message: "Bathroom sections saved successfully" };
  } catch (error) {
    console.error("Error saving bathroom sections:", error);
    return { success: false, message: "Failed to save bathroom sections" };
  }
}

export async function saveKitchenSections(sections: KitchenSection[]) {
  try {
    await db.transaction(async (tx) => {
      // Get all existing section IDs
      const existingSections = await tx.select({ id: kitchenSections.id }).from(kitchenSections);
      const existingIds = new Set(existingSections.map((section) => section.id));

      for (const section of sections) {
        if (existingIds.has(section.id)) {
          // Update existing section
          await tx
            .update(kitchenSections)
            .set({
              section: section.section,
              title: section.title,
              description: section.description,
              name: section.name,
              image: section.image,
              images: section.images,
              linkText: section.linkText,
              linkUrl: section.linkUrl,
              order: section.order,
              updatedAt: new Date(),
            })
            .where(eq(kitchenSections.id, section.id));
          existingIds.delete(section.id);
        } else {
          // Insert new section
          await tx.insert(kitchenSections).values({
            section: section.section,
            title: section.title,
            description: section.description,
            name: section.name,
            image: section.image,
            images: section.images,
            linkText: section.linkText,
            linkUrl: section.linkUrl,
            order: section.order,
          });
        }
      }

      // Delete sections that are no longer present
      for (const id of existingIds) {
        await tx.delete(kitchenSections).where(eq(kitchenSections.id, id));
      }
    });

    return { success: true, message: "Kitchen sections saved successfully" };
  } catch (error) {
    console.error("Error saving kitchen sections:", error);
    return { success: false, message: "Failed to save kitchen sections" };
  }
}
