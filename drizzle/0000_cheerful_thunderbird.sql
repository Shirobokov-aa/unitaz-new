CREATE TABLE "about_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"banner_name" text NOT NULL,
	"banner_image" text NOT NULL,
	"banner_title" text NOT NULL,
	"banner_description" text NOT NULL,
	"banner_link" jsonb NOT NULL,
	"sections" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "auth_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "bathroom_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"title" text,
	"description" text,
	"name" text,
	"image" text,
	"images" jsonb NOT NULL,
	"link_text" text,
	"link_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collection_previews" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"desc" varchar(1000) NOT NULL,
	"link" varchar(255) NOT NULL,
	"flex_direction" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link_text" text,
	"link_url" text,
	"title_desc" text,
	"description_desc" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"banner_image" text,
	"banner_title" text,
	"banner_description" text,
	"banner_link_text" text,
	"banner_link_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "image_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"desktop_image" text NOT NULL,
	"mobile_image" text NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kitchen_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"title" text,
	"description" text,
	"name" text,
	"image" text,
	"images" jsonb NOT NULL,
	"link_text" text,
	"link_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "main_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"title" text,
	"description" text,
	"link_name" text,
	"link_url" text,
	"main_image" text,
	"images" text[],
	"image_block_srcs" text[],
	"image_block_alts" text[],
	"image_block_descs" text[],
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sub_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"href" text NOT NULL,
	"category_id" integer
);
--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;