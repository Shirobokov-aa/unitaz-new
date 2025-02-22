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
  KitchenSection,
  kitchenSections,
  MainSection,
  mainSections,
  subCategories,
  collectionPreviews,
  CollectionPreview,
  collections,
  collectionSections,
  Collection,
  CollectionSection,
  catalogProducts,
  catalogFilters,
  catalogBanner,
  type InsertCatalogProduct,
  type CatalogFilter,
  type CatalogBanner,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type CollectionWithSections = Collection & { sections: CollectionSection[] };

export async function saveCollection(data: CollectionWithSections) {
  try {
    await db.transaction(async (tx) => {
      // Обновляем или создаем коллекцию
      if (data.id) {
        await tx
          .update(collections)
          .set({
            name: data.name,
            bannerImage: data.bannerImage,
            bannerTitle: data.bannerTitle,
            bannerDescription: data.bannerDescription,
            bannerLinkText: data.bannerLinkText,
            bannerLinkUrl: data.bannerLinkUrl,
            updatedAt: new Date(),
          })
          .where(eq(collections.id, data.id));
      } else {
        const [inserted] = await tx
          .insert(collections)
          .values({
            name: data.name,
            bannerImage: data.bannerImage,
            bannerTitle: data.bannerTitle,
            bannerDescription: data.bannerDescription,
            bannerLinkText: data.bannerLinkText,
            bannerLinkUrl: data.bannerLinkUrl,
          })
          .returning();
        data.id = inserted.id;
      }

      // Получаем существующие секции
      const existingSections = await tx
        .select({ id: collectionSections.id })
        .from(collectionSections)
        .where(eq(collectionSections.collectionId, data.id));

      const existingIds = new Set(existingSections.map(section => section.id));

      // Обновляем или создаем секции
      for (const section of data.sections) {
        if (existingIds.has(section.id)) {
          await tx
            .update(collectionSections)
            .set({
              type: section.type,
              title: section.title,
              description: section.description,
              linkText: section.linkText,
              linkUrl: section.linkUrl,
              titleDesc: section.titleDesc,
              descriptionDesc: section.descriptionDesc,
              images: section.images,
              order: section.order,
            })
            .where(eq(collectionSections.id, section.id));
          existingIds.delete(section.id);
        } else {
          await tx.insert(collectionSections).values({
            collectionId: data.id,
            type: section.type,
            title: section.title,
            description: section.description,
            linkText: section.linkText,
            linkUrl: section.linkUrl,
            titleDesc: section.titleDesc,
            descriptionDesc: section.descriptionDesc,
            images: section.images,
            order: section.order,
          });
        }
      }

      // Удаляем секции, которых больше нет
      for (const id of existingIds) {
        await tx
          .delete(collectionSections)
          .where(eq(collectionSections.id, id));
      }
    });

    return { success: true, message: "Коллекция сохранена успешно" };
  } catch (error) {
    console.error("Ошибка сохранения коллекции:", error);
    return { success: false, message: "Не удалось сохранить коллекцию" };
  }
}

// ===========

// Добавьте новую функцию здесь, перед saveCategories
export async function saveCollectionPreviews(previews: CollectionPreview[]) {
  try {
    await db.transaction(async (tx) => {
      const existingPreviews = await tx.select({ id: collectionPreviews.id }).from(collectionPreviews);
      const existingIds = new Set(existingPreviews.map((preview) => preview.id));

      for (const preview of previews) {
        if (existingIds.has(preview.id)) {
          // Обновляем существующее превью и коллекцию
          await Promise.all([
            tx.update(collectionPreviews)
              .set({
                image: preview.image,
                title: preview.title,
                desc: preview.desc,
                link: preview.link,
                flexDirection: preview.flexDirection,
              })
              .where(eq(collectionPreviews.id, preview.id)),

            tx.update(collections)
              .set({
                name: preview.title,
                bannerImage: preview.image,
                bannerTitle: preview.title,
                bannerDescription: preview.desc,
                updatedAt: new Date(),
              })
              .where(eq(collections.id, preview.id))
          ]);

          existingIds.delete(preview.id);
        } else {
          // Создаем новое превью и коллекцию атомарно
          await tx.insert(collectionPreviews).values({
            id: preview.id,
            image: preview.image,
            title: preview.title,
            desc: preview.desc,
            link: preview.link,
            flexDirection: preview.flexDirection,
          });

          await tx.insert(collections).values({
            id: preview.id,
            name: preview.title,
            bannerImage: preview.image,
            bannerTitle: preview.title,
            bannerDescription: preview.desc,
            bannerLinkText: 'Подробнее',
            bannerLinkUrl: preview.link,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Создаем базовую секцию
          await tx.insert(collectionSections).values({
            collectionId: preview.id,
            type: 'section',
            title: 'Новая секция',
            description: 'Описание секции',
            images: [],
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Удаляем устаревшие записи
      for (const id of existingIds) {
        await Promise.all([
          tx.delete(collectionPreviews).where(eq(collectionPreviews.id, id)),
          tx.delete(collections).where(eq(collections.id, id)),
          tx.delete(collectionSections).where(eq(collectionSections.collectionId, id))
        ]);
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    return { success: false, message: error instanceof Error ? error.message : "Неизвестная ошибка" };
  }
}

export async function saveCategories(categoriesData: CategoryWithSubCategories[]) {
  try {
    await db.transaction(async (tx) => {
      const existingCategories = await tx.select().from(categories);
      const existingIds = new Set(existingCategories.map(cat => cat.id));

      for (const category of categoriesData) {
        if (category.id && existingIds.has(category.id)) {
          await tx
            .update(categories)
            .set({
              name: category.name,
              images: category.images,
              updatedAt: new Date(),
            })
            .where(eq(categories.id, category.id));

          // Удаляем старые подкатегории
          await tx
            .delete(subCategories)
            .where(eq(subCategories.categoryId, category.id));

          existingIds.delete(category.id);
        } else {
          // Создаем новую категорию
          const [inserted] = await tx
            .insert(categories)
            .values({
              name: category.name,
              images: category.images,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();

          category.id = inserted.id;
        }

        // Добавляем новые подкатегории
        if (category.subCategories.length > 0) {
          await tx.insert(subCategories).values(
            category.subCategories.map(sub => ({
              name: sub.name,
              href: sub.href,
              categoryId: category.id
            }))
          );
        }
      }

      // Удаляем категории, которых больше нет
      for (const id of existingIds) {
        await tx.delete(categories).where(eq(categories.id, id));
      }
    });

    return { success: true, message: "Categories saved successfully" };
  } catch (error) {
    console.error("Error saving categories:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save categories"
    };
  }
}

export async function saveImageSlides(slides: ImageSlide[]) {
  try {
    console.log('Saving slides:', slides); // Для отладки
    await db.transaction(async (tx) => {
      const existingSlides = await tx.select().from(imageSlides);
      const existingIds = new Set(existingSlides.map(slide => slide.id));

      for (const slide of slides) {
        const slideData = {
          desktopImage: slide.desktopImage,
          mobileImage: slide.mobileImage,
          title: slide.title,
          titleUrl: slide.titleUrl || '/', // Используем уникальный URL для каждого слайда
        };

        if (existingIds.has(slide.id)) {
          // Обновляем существующий слайд
          await tx
            .update(imageSlides)
            .set(slideData)
            .where(eq(imageSlides.id, slide.id));
          existingIds.delete(slide.id);
        } else {
          // Создаем новый слайд
          await tx.insert(imageSlides).values(slideData);
        }
      }

      // Удаляем слайды, которых больше нет
      for (const id of existingIds) {
        await tx.delete(imageSlides).where(eq(imageSlides.id, id));
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/slides');
    return { success: true };
  } catch (error) {
    console.error("Error saving slides:", error);
    return { success: false, error };
  }
}

export async function saveMainSections(sections: MainSection[]) {
  try {
    await db.transaction(async (tx) => {
      // Получаем все существующие секции
      const existingSections = await tx.select({ id: mainSections.id }).from(mainSections);
      const existingIds = new Set(existingSections.map(section => section.id));

      for (const section of sections) {
        console.log('Processing main section:', {
          id: section.id,
          type: section.section,
          hasMainImage: !!section.mainImage,
          imageBlockCount: section.imageBlockSrcs?.length
        });

        if (existingIds.has(section.id)) {
          // Обновляем существующую секцию
          await tx
            .update(mainSections)
            .set({
              section: section.section,
              title: section.title,
              description: section.description,
              mainImage: section.mainImage,
              imageBlockSrcs: section.imageBlockSrcs || [],
              imageBlockAlts: section.imageBlockAlts || [],
              imageBlockDescs: section.imageBlockDescs || [],
              linkName: section.linkName,
              linkUrl: section.linkUrl,
              order: section.order,
              updatedAt: new Date(),
            })
            .where(eq(mainSections.id, section.id));
          existingIds.delete(section.id);
        } else {
          // Создаем новую секцию
          await tx.insert(mainSections).values({
            section: section.section,
            title: section.title,
            description: section.description,
            mainImage: section.mainImage,
            imageBlockSrcs: section.imageBlockSrcs || [],
            imageBlockAlts: section.imageBlockAlts || [],
            imageBlockDescs: section.imageBlockDescs || [],
            linkName: section.linkName,
            linkUrl: section.linkUrl,
            order: section.order,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Удаляем секции, которых больше нет
      for (const id of existingIds) {
        await tx.delete(mainSections).where(eq(mainSections.id, id));
      }
    });

    return { success: true, message: "Main sections saved successfully" };
  } catch (error) {
    console.error("Error saving main sections:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save main sections"
    };
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
      const existingSections = await tx.select({ id: bathroomSections.id }).from(bathroomSections);
      const existingIds = new Set(existingSections.map((section) => section.id));

      for (const section of sections) {
        // Проверяем тип секции
        if (!["banner", "section", "collection"].includes(section.section)) {
          console.error(`Invalid section type: ${section.section}`);
          continue;
        }

        console.log('Processing section:', {
          id: section.id,
          type: section.section,
          title: section.title,
          hasImage: !!section.image,
          imagesCount: section.images?.length
        });

        if (existingIds.has(section.id)) {
          await tx
            .update(bathroomSections)
            .set({
              section: section.section,
              title: section.title,
              description: section.description,
              name: section.name,
              image: section.image,
              images: section.images || [], // Убедимся, что images не undefined
              linkText: section.linkText,
              linkUrl: section.linkUrl,
              order: section.order,
              updatedAt: new Date(),
            })
            .where(eq(bathroomSections.id, section.id));
          existingIds.delete(section.id);
        } else {
          await tx.insert(bathroomSections).values({
            section: section.section,
            title: section.title,
            description: section.description,
            name: section.name,
            image: section.image,
            images: section.images || [], // Убедимся, что images не undefined
            linkText: section.linkText,
            linkUrl: section.linkUrl,
            order: section.order,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Удаляем секции, которых больше нет
      for (const id of existingIds) {
        await tx.delete(bathroomSections).where(eq(bathroomSections.id, id));
      }
    });

    return { success: true, message: "Bathroom sections saved successfully" };
  } catch (error) {
    console.error("Error saving bathroom sections:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save bathroom sections"
    };
  }
}

export async function saveKitchenSections(sections: KitchenSection[]) {
  console.log('Saving kitchen sections:', {
    totalSections: sections.length,
    sections: sections.map(s => ({
      type: s.section,
      isImage: !!s.image,
      hasImages: s.images?.length > 0
    }))
  });

  try {
    await db.transaction(async (tx) => {
      const existingSections = await tx.select({ id: kitchenSections.id }).from(kitchenSections);
      const existingIds = new Set(existingSections.map((section) => section.id));

      for (const section of sections) {
        const sectionData = {
          section: section.section,
          title: section.title,
          description: section.description,
          name: section.name,
          image: section.image || '', // Убедимся, что поле image не undefined
          images: section.images || [],
          linkText: section.linkText,
          linkUrl: section.linkUrl,
          order: section.order,
          updatedAt: new Date(),
        };

        console.log('Processing section:', {
          id: section.id,
          type: section.section,
          isNew: !existingIds.has(section.id),
          hasImage: !!section.image,
          imageData: section.image
        });

        if (existingIds.has(section.id)) {
          await tx
            .update(kitchenSections)
            .set(sectionData)
            .where(eq(kitchenSections.id, section.id));
          existingIds.delete(section.id);
        } else {
          await tx.insert(kitchenSections).values({
            ...sectionData,
            createdAt: new Date(),
          });
        }
      }

      // Удаляем старые секции
      for (const id of existingIds) {
        await tx.delete(kitchenSections).where(eq(kitchenSections.id, id));
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving kitchen sections:", error);
    throw error;
  }
}

export async function saveCatalogProduct(product: InsertCatalogProduct) {
  try {
    let savedProduct;

    await db.transaction(async (tx) => {
      if (product.id) {
        [savedProduct] = await tx
          .update(catalogProducts)
          .set({
            ...product,
            updatedAt: new Date(),
          })
          .where(eq(catalogProducts.id, product.id))
          .returning();
      } else {
        [savedProduct] = await tx
          .insert(catalogProducts)
          .values({
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
      }
    });

    // Добавляем ревалидацию для страницы каталога
    revalidatePath('/catalog');
    revalidatePath(`/catalog/${product.id}`);
    revalidatePath('/admin/catalog');
    revalidatePath(`/admin/catalog/${product.id}`);

    return {
      success: true,
      product: savedProduct
    };
  } catch (error) {
    console.error("Error saving product:", error);
    return { success: false, error };
  }
}

export async function saveCatalogFilters(filters: CatalogFilter[]) {
  try {
    await db.transaction(async (tx) => {
      const existingFilters = await tx.select().from(catalogFilters);
      const existingIds = new Set(existingFilters.map(filter => filter.id));

      for (const filter of filters) {
        if (existingIds.has(filter.id)) {
          await tx
            .update(catalogFilters)
            .set(filter)
            .where(eq(catalogFilters.id, filter.id));
          existingIds.delete(filter.id);
        } else {
          await tx.insert(catalogFilters).values(filter);
        }
      }

      for (const id of existingIds) {
        await tx.delete(catalogFilters).where(eq(catalogFilters.id, id));
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving filters:", error);
    return { success: false, error };
  }
}

export async function deleteCatalogProduct(id: number) {
  try {
    await db.delete(catalogProducts).where(eq(catalogProducts.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error };
  }
}

export async function saveCatalogBanner(banner: Omit<CatalogBanner, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const existingBanner = await db.query.catalogBanner.findFirst();

    await db.transaction(async (tx) => {
      if (existingBanner) {
        await tx
          .update(catalogBanner)
          .set({
            ...banner,
            updatedAt: new Date(),
          })
          .where(eq(catalogBanner.id, existingBanner.id));
      } else {
        await tx.insert(catalogBanner).values({
          ...banner,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving catalog banner:", error);
    return { success: false, error };
  }
}
