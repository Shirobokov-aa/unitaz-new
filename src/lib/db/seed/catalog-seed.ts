import { db } from "@/lib/db";
import { catalogProducts, catalogFilters, catalogBanner, categories, subCategories } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

export async function seedCatalog() {
  try {
    // Сначала удаляем все существующие данные
    await db.transaction(async (tx) => {
      await tx.delete(catalogProducts);
      await tx.delete(catalogFilters);
      await tx.delete(catalogBanner);
      await tx.delete(subCategories);
      await tx.delete(categories);
    });

    // Теперь создаем новые данные
    const [smesiteliCategory, rakovinyCategory] = await db.insert(categories).values([
      {
        name: "Смесители",
        images: ["/images/categories/smesiteli.jpg"],
      },
      {
        name: "Раковины",
        images: ["/images/categories/rakoviny.jpg"],
      },
    ]).returning();

    // Затем создаем подкатегории
    const [
      dlya_rakoviny,
      dlya_dusha,
      nakladnye
    ] = await db.insert(subCategories).values([
      {
        name: "Для раковины",
        href: "/catalog/smesiteli/dlya-rakoviny",
        categoryId: smesiteliCategory.id,
      },
      {
        name: "Для душа",
        href: "/catalog/smesiteli/dlya-dusha",
        categoryId: smesiteliCategory.id,
      },
      {
        name: "Накладные",
        href: "/catalog/rakoviny/nakladnye",
        categoryId: rakovinyCategory.id,
      },
    ]).returning();

    // Создаем баннер каталога
    await db.insert(catalogBanner).values({
      name: "Каталог сантехники",
      image: "/images/catalog-banner.jpg",
      title: "Широкий выбор сантехники",
      description: "Найдите идеальное решение для вашей ванной комнаты",
      linkText: "Подробнее о коллекциях",
      linkUrl: "/collections",
    });

    // Создаем фильтры для категорий
    await db.insert(catalogFilters).values([
      {
        name: "Цвет",
        type: "checkbox",
        values: [
          { label: "Черный матовый", value: "black-matte" },
          { label: "Хром", value: "chrome" },
          { label: "Золото", value: "gold" },
        ],
        categoryId: smesiteliCategory.id,
        order: 1,
      },
      {
        name: "Тип монтажа",
        type: "checkbox",
        values: [
          { label: "Настенный", value: "wall-mounted" },
          { label: "Напольный", value: "floor-mounted" },
          { label: "Встраиваемый", value: "built-in" },
        ],
        categoryId: rakovinyCategory.id,
        order: 2,
      },
    ]);

    // Создаем тестовые товары с правильными ID категорий
    await db.insert(catalogProducts).values([
      {
        name: "Смеситель для раковины ERA",
        article: "172728229829",
        price: 15000,
        description: "Современный смеситель с матовым покрытием",
        images: ["/images/products/faucet-1.jpg"],
        colors: [
          { name: "Черный матовый", code: "#000000" },
          { name: "Хром", code: "#C0C0C0" },
        ],
        characteristics: [
          { name: "Высота", value: "150 мм" },
          { name: "Материал", value: "Латунь" },
          { name: "Гарантия", value: "5 лет" },
        ],
        technicalDocs: [
          { name: "Инструкция по установке", url: "/docs/installation.pdf" },
          { name: "Технический паспорт", url: "/docs/specifications.pdf" },
        ],
        categoryId: smesiteliCategory.id,
        subCategoryId: dlya_rakoviny.id,
      },
      {
        name: "Душевая система AQUA",
        article: "182738229830",
        price: 25000,
        description: "Комплексная душевая система с тропическим душем",
        images: ["/images/products/shower-1.jpg"],
        colors: [
          { name: "Хром", code: "#C0C0C0" },
          { name: "Золото", code: "#FFD700" },
        ],
        characteristics: [
          { name: "Размер лейки", value: "200x200 мм" },
          { name: "Материал", value: "Нержавеющая сталь" },
          { name: "Гарантия", value: "7 лет" },
        ],
        technicalDocs: [
          { name: "Инструкция по монтажу", url: "/docs/shower-install.pdf" },
        ],
        categoryId: smesiteliCategory.id,
        subCategoryId: dlya_dusha.id,
      },
      {
        name: "Раковина MODERN",
        article: "192748229831",
        price: 18000,
        description: "Накладная раковина в современном стиле",
        images: ["/images/products/sink-1.jpg"],
        colors: [
          { name: "Белый", code: "#FFFFFF" },
        ],
        characteristics: [
          { name: "Размеры", value: "600x400 мм" },
          { name: "Материал", value: "Керамика" },
          { name: "Тип монтажа", value: "Накладной" },
        ],
        technicalDocs: [
          { name: "Схема монтажа", url: "/docs/sink-scheme.pdf" },
        ],
        categoryId: rakovinyCategory.id,
        subCategoryId: nakladnye.id,
      },
    ]);

    console.log("✅ Тестовые данные для каталога успешно добавлены");
  } catch (error) {
    console.error("❌ Ошибка при добавлении тестовых данных:", error);
  }
}

// Добавляем прямой вызов функции если файл запущен напрямую
if (require.main === module) {
  seedCatalog()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error seeding catalog:", error);
      process.exit(1);
    });
}
