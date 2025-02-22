import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// Base Tables
// ============================================================================

export const authUsers = pgTable("auth_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Category System
// ============================================================================

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subCategories = pgTable("sub_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  href: text("href").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
});


// ============================================================================
// Content Management
// ============================================================================

export const imageSlides = pgTable("image_slides", {
  id: serial("id").primaryKey(),
  desktopImage: text("desktop_image").notNull(),
  mobileImage: text("mobile_image").notNull(),
  title: text("title").notNull(),
});

export const mainSections = pgTable("main_sections", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().$type<"intro" | "banner" | "feature" | "collections" | "showcase">(),
  title: text("title"),
  description: text("description"),
  linkName: text("link_name"),
  linkUrl: text("link_url"),
  mainImage: text("main_image"),
  images: text("images").array(),
  imageBlockSrcs: text("image_block_srcs").array(),
  imageBlockAlts: text("image_block_alts").array(),
  imageBlockDescs: text("image_block_descs").array(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Pages
// ============================================================================

export const aboutPage = pgTable("about_page", {
  id: serial("id").primaryKey(),
  bannerName: text("banner_name").notNull(),
  bannerImage: text("banner_image").notNull(),
  bannerTitle: text("banner_title").notNull(),
  bannerDescription: text("banner_description").notNull(),
  bannerLink: jsonb("banner_link")
    .$type<{
      text: string;
      url: string;
    }>()
    .notNull(),
  sections: jsonb("sections")
    .$type<
      {
        title: string;
        description: string;
      }[]
    >()
    .notNull(),
});

// Shared type for section pages
type SectionType = "banner" | "section" | "collection";
type ImageType = { src: string; alt: string; desc: string };

export const bathroomSections = pgTable("bathroom_sections", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().$type<SectionType>(),
  title: text("title"),
  description: text("description"),
  name: text("name"),
  image: text("image"),
  images: jsonb("images").$type<ImageType[]>().notNull(),
  linkText: text("link_text"),
  linkUrl: text("link_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const kitchenSections = pgTable("kitchen_sections", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().$type<SectionType>(),
  title: text("title"),
  description: text("description"),
  name: text("name"),
  image: text("image"),
  images: jsonb("images").$type<ImageType[]>().notNull(),
  linkText: text("link_text"),
  linkUrl: text("link_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Collections
// ============================================================================

export const collectionPreviews = pgTable("collection_previews", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  desc: varchar("desc", { length: 1000 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  flexDirection: varchar("flex_direction", { length: 50 }).notNull().$type<"xl:flex-row" | "xl:flex-row-reverse">(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bannerImage: text("banner_image"),
  bannerTitle: text("banner_title"),
  bannerDescription: text("banner_description"),
  bannerLinkText: text("banner_link_text"),
  bannerLinkUrl: text("banner_link_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collectionSections = pgTable("sections", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => collections.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull().$type<"section" | "section2" | "section3" | "section4">(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  linkText: text("link_text"),
  linkUrl: text("link_url"),
  titleDesc: text("title_desc"),
  descriptionDesc: text("description_desc"),
  images: jsonb("images")
    .$type<
      {
        src: string;
        alt: string;
      }[]
    >()
    .default([]),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Types
// ============================================================================

// Select Types
export type AuthUser = typeof authUsers.$inferSelect;
export type SubCategory = typeof subCategories.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type ImageSlide = typeof imageSlides.$inferSelect;
export type MainSection = typeof mainSections.$inferSelect;
export type AboutPage = typeof aboutPage.$inferSelect;
export type BathroomSection = typeof bathroomSections.$inferSelect;
export type KitchenSection = typeof kitchenSections.$inferSelect;
export type CollectionPreview = typeof collectionPreviews.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type CollectionSection = typeof collectionSections.$inferSelect;
export type CollectionWithSections = Collection & {
  sections: CollectionSection[];
};

// Insert Types
export type InsertAuthUser = typeof authUsers.$inferInsert;
export type InsertSubCategory = typeof subCategories.$inferInsert;
export type InsertCategory = typeof categories.$inferInsert;
export type InsertImageSlide = typeof imageSlides.$inferInsert;
export type InsertMainSection = typeof mainSections.$inferInsert;
export type InsertAboutPage = typeof aboutPage.$inferInsert;
export type InsertBathroomSection = typeof bathroomSections.$inferInsert;
export type InsertKitchenSection = typeof kitchenSections.$inferInsert;
export type InsertCollectionPreview = typeof collectionPreviews.$inferInsert;
export type InsertCollection = typeof collections.$inferInsert;
export type InsertCollectionSection = typeof collectionSections.$inferInsert;

export interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

// ============================================================================
// Relations
// ============================================================================

export const categoriesRelations = relations(categories, ({ many }) => ({
  subCategories: many(subCategories),
}));

export const subCategoriesRelations = relations(subCategories, ({ one }) => ({
  category: one(categories, {
    fields: [subCategories.categoryId],
    references: [categories.id],
  }),
}));

// export const categoriesRelations = relations(categories, ({ many }) => ({
//   subCategories: many(subCategories, {
//     relationName: "category",
//   }),
// }));

// export const subCategoriesRelations = relations(subCategories, ({ one }) => ({
//   category: one(categories, {
//     fields: [subCategories.categoryId],
//     references: [categories.id],
//   }),
// }));

export const collectionsRelations = relations(collections, ({ many }) => ({
  sections: many(collectionSections),
}));

export const sectionsRelations = relations(collectionSections, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionSections.collectionId],
    references: [collections.id],
  }),
}));


// ============================================================================

// Catalog System
export const catalogProducts = pgTable("catalog_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  article: text("article").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<{
    name: string;
    code: string;
  }[]>().notNull().default([]),
  characteristics: jsonb("characteristics").$type<{
    name: string;
    value: string;
  }[]>().notNull().default([]),
  technicalDocs: jsonb("technical_docs").$type<{
    name: string;
    url: string;
  }[]>().notNull().default([]),
  categoryId: integer("category_id").references(() => categories.id),
  subCategoryId: integer("sub_category_id").references(() => subCategories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const catalogFilters = pgTable("catalog_filters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  values: jsonb("values").$type<{
    label: string;
    value: string;
  }[]>().notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  order: integer("order").notNull().default(0),
});

export const catalogBanner = pgTable("catalog_banner", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  linkText: text("link_text"),
  linkUrl: text("link_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type CatalogProduct = typeof catalogProducts.$inferSelect;
export type InsertCatalogProduct = typeof catalogProducts.$inferInsert;
export type CatalogFilter = typeof catalogFilters.$inferSelect;
export type CatalogBanner = typeof catalogBanner.$inferSelect;

// Relations
export const catalogProductsRelations = relations(catalogProducts, ({ one }) => ({
  category: one(categories, {
    fields: [catalogProducts.categoryId],
    references: [categories.id],
  }),
  subCategory: one(subCategories, {
    fields: [catalogProducts.subCategoryId],
    references: [subCategories.id],
  }),
}));

export const catalogFiltersRelations = relations(catalogFilters, ({ one }) => ({
  category: one(categories, {
    fields: [catalogFilters.categoryId],
    references: [categories.id],
  }),
}));
