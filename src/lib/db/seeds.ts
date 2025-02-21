import { db } from "@/lib/db";
import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

import {
  authUsers,
  type InsertAuthUser,  // Используем существующий тип
  aboutPage,
  categories,
  // imageSlides,
  mainSections,
  subCategories,
  bathroomSections,
  kitchenSections,
  collectionPreviews,
  collections,
  collectionSections,
} from "./schema";


// import path from "path";
// import { readFileSync } from "fs";

// // Добавляем настройку для WebAssembly
// const wasmPath = path.join(process.cwd(), "node_modules/argon2-browser/dist/argon2.wasm");
// const wasmBinary = readFileSync(wasmPath);

// // Эмулируем браузерное окружение
// (global as any).self = global;
// (global as any).WebAssembly = WebAssembly;
// (global as any).Module = {
//   wasmBinary,
//   onRuntimeInitialized: () => {
//     console.log("WebAssembly module initialized");
//   }
// };

async function seed(): Promise<void> {
  console.log("Начало заполнения базы данных");

  try {
    await db.delete(authUsers);
    // Очищаем таблицы
    await db.delete(kitchenSections);
    await db.delete(bathroomSections);
    await db.delete(collectionSections);
    await db.delete(collections);
    await db.delete(collectionPreviews);
    await db.delete(subCategories);
    await db.delete(categories);
    await db.delete(mainSections);
    await db.delete(aboutPage);

    const existingUser = await db.query.authUsers.findFirst({
      where: eq(authUsers.username, "admin")
    });

    // Используем обычный argon2 для хеширования
    const salt = randomBytes(16);
    const hashedPassword = await argon2.hash(process.env.ADMIN_PASSWORD || "123456", {
      salt,
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1
    });

    if (existingUser) {
      await db.update(authUsers)
        .set({ password: hashedPassword })
        .where(eq(authUsers.username, "admin"));
      console.log("Пароль пользователя admin обновлен");
    } else {
      const newUser: InsertAuthUser = {
        username: "admin",
        password: hashedPassword,
      };
      await db.insert(authUsers).values(newUser);
      console.log("Создан новый пользователь admin");
    }

  // Categories and SubCategories
  await db.insert(categories).values([
    {
      id: 1,
      name: "Ванные комнаты",
      images: ["/bathrooms/cat1.jpg", "/bathrooms/cat2.jpg"],
    },
    {
      id: 2,
      name: "Кухни",
      images: ["/kitchens/cat1.jpg", "/kitchens/cat2.jpg"],
    },
  ]);

  await db.insert(subCategories).values([
    {
      id: 1,
      name: "Классические ванные",
      href: "/bathroom/classic",
      categoryId: 1,
    },
    {
      id: 2,
      name: "Современные ванные",
      href: "/bathroom/modern",
      categoryId: 1,
    },
    {
      id: 3,
      name: "Кухни в стиле лофт",
      href: "/kitchen/loft",
      categoryId: 2,
    },
    {
      id: 4,
      name: "Минималистичные кухни",
      href: "/kitchen/minimal",
      categoryId: 2,
    },
  ]);

  // Main Sections
  await db.insert(mainSections).values([
    {
      section: "intro",
      title: "Добро пожаловать в Abelsberg",
      description: "Мы создаем уникальные интерьерные решения",
      linkName: "Узнать больше",
      linkUrl: "/about",
      mainImage: "/main/intro.jpg",
      images: ["/main/gallery1.jpg", "/main/gallery2.jpg"],
      imageBlockSrcs: ["/blocks/1.jpg", "/blocks/2.jpg"],
      imageBlockAlts: ["Интерьер 1", "Интерьер 2"],
      imageBlockDescs: ["Описание 1", "Описание 2"],
      order: 1,
    },
    {
      section: "collections",
      title: "Наши коллекции",
      description: "Изучите наши лучшие работы",
      order: 2,
    },
  ]);

  // Collections
  await db.insert(collections).values([
    {
      id: 1,
      name: "Современная классика",
      bannerImage: "/collections/modern-classic/banner.jpg",
      bannerTitle: "Современная классика",
      bannerDescription: "Сочетание традиций и современности",
      bannerLinkText: "Посмотреть коллекцию",
      bannerLinkUrl: "/collections/modern-classic",
    },
  ]);

  await db.insert(collectionSections).values([
    {
      collectionId: 1,
      type: "section",
      title: "Элегантность в деталях",
      description: "Каждая деталь имеет значение",
      linkText: "Подробнее",
      linkUrl: "/collections/modern-classic/details",
      order: 1,
      images: [
        { src: "/collections/modern-classic/1.jpg", alt: "Интерьер 1" },
        { src: "/collections/modern-classic/2.jpg", alt: "Интерьер 2" },
      ],
    },
  ]);

  // Collection Previews
  await db.insert(collectionPreviews).values([
    {
      image: "/previews/bathroom.jpg",
      title: "Ванные комнаты",
      desc: "Создайте оазис комфорта",
      link: "/collections/bathrooms",
      flexDirection: "xl:flex-row",
    },
    {
      image: "/previews/kitchen.jpg",
      title: "Кухни",
      desc: "Пространство для кулинарного творчества",
      link: "/collections/kitchens",
      flexDirection: "xl:flex-row-reverse",
    },
  ]);

  // About Page
  await db.insert(aboutPage).values({
    id: 1,
    bannerName: "О нас",
    bannerImage: "/about/banner.jpg",
    bannerTitle: "История Abelsberg",
    bannerDescription: "Создаем комфорт с 2010 года",
    bannerLink: {
      text: "Связаться с нами",
      url: "/contact",
    },
    sections: [
      {
        title: "Наша миссия",
        description: "Создавать уникальные интерьеры, которые вдохновляют",
      },
      {
        title: "Наш подход",
        description: "Индивидуальный подход к каждому проекту",
      },
    ],
  });

  // Bathroom Sections
  await db.insert(bathroomSections).values([
    {
      section: "banner",
      title: "Ванные комнаты",
      description: "Создайте свой идеальный интерьер",
      name: "main-banner",
      image: "/bathroom/banner.jpg",
      images: [
        { src: "/bathroom/1.jpg", alt: "Ванная 1", desc: "Современный дизайн" },
        { src: "/bathroom/2.jpg", alt: "Ванная 2", desc: "Классический стиль" },
      ],
      order: 1,
    },
  ]);

  // Kitchen Sections
  await db.insert(kitchenSections).values([
    {
      section: "banner",
      title: "Кухни",
      description: "Функциональность и стиль",
      name: "main-banner",
      image: "/kitchen/banner.jpg",
      images: [
        { src: "/kitchen/1.jpg", alt: "Кухня 1", desc: "Современный дизайн" },
        { src: "/kitchen/2.jpg", alt: "Кухня 2", desc: "Минималистичный стиль" },
      ],
      order: 1,
    },
  ]);

  console.log("База данных успешно заполнена");
} catch (error) {
  console.error("Ошибка при заполнении базы данных:", error);
  process.exit(1);
}
};

seed();
