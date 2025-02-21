"use client";

import type React from "react";

import { useState, useCallback } from "react";
import type { BathroomSection } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { saveBathroomSections } from "@/actions/inserts";

type SectionType = "banner" | "sections" | "collections";
type ImageType = { src: string; alt: string; desc: string };

interface BathroomPageData {
  banner: BathroomSection | null;
  sections: BathroomSection[];
  collections: BathroomSection[];
}

interface BathroomPageManagerProps {
  initialData: BathroomPageData;
}

export function BathroomPageManager({ initialData }: BathroomPageManagerProps) {
  const [bathroomData, setBathroomData] = useState<BathroomPageData>(initialData);
  const router = useRouter();

  const updateSection = useCallback(
    (type: SectionType, index: number, field: keyof BathroomSection, value: string | number | ImageType[]) => {
      setBathroomData((prev) => {
        if (type === "banner") {
          return { ...prev, banner: prev.banner ? { ...prev.banner, [field]: value } : null };
        } else {
          const newData = { ...prev };
          newData[type][index] = { ...newData[type][index], [field]: value };
          return newData;
        }
      });
    },
    []
  );

  const addSection = useCallback((type: "sections" | "collections") => {
    setBathroomData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          id: 0,
          section: type,
          title: "",
          description: "",
          name: "",
          image: "",
          images: [],
          linkText: "",
          linkUrl: "",
          order: prev[type].length,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }));
  }, []);

  const removeSection = useCallback((type: "sections" | "collections", index: number) => {
    setBathroomData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  }, []);

  const handleImageUpload = useCallback(
    async (type: SectionType, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          updateSection(type, index, "image", base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    [updateSection]
  );

  const addImage = useCallback((type: SectionType, sectionIndex: number) => {
    setBathroomData((prev) => {
      const newData = { ...prev };
      const section = type === "banner" ? newData.banner : newData[type][sectionIndex];
      if (section) {
        section.images = [...section.images, { src: "", alt: "", desc: "" }];
      }
      return newData;
    });
  }, []);

  const updateImage = useCallback(
    (type: SectionType, sectionIndex: number, imageIndex: number, field: keyof ImageType, value: string) => {
      setBathroomData((prev) => {
        const newData = { ...prev };
        const section = type === "banner" ? newData.banner : newData[type][sectionIndex];
        if (section) {
          section.images[imageIndex] = { ...section.images[imageIndex], [field]: value };
        }
        return newData;
      });
    },
    []
  );

  const removeImage = useCallback((type: SectionType, sectionIndex: number, imageIndex: number) => {
    setBathroomData((prev) => {
      const newData = { ...prev };
      const section = type === "banner" ? newData.banner : newData[type][sectionIndex];
      if (section) {
        section.images = section.images.filter((_, i) => i !== imageIndex);
      }
      return newData;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allSections = [
        ...(bathroomData.banner ? [bathroomData.banner] : []),
        ...bathroomData.sections,
        ...bathroomData.collections,
      ];
      await saveBathroomSections(allSections);
      toast({ title: "Success", description: "Bathroom page saved successfully" });
      router.refresh();
    } catch (error) {
      console.error("Error saving bathroom page:", error);
      toast({ title: "Error", description: "Failed to save bathroom page", variant: "destructive" });
    }
  };

  const renderSectionForm = (type: SectionType, section: BathroomSection, index: number) => (
    <div key={section.id || index} className="border p-4 rounded-lg space-y-4 mb-4">
      <Input
        value={section.title || ""}
        onChange={(e) => updateSection(type, index, "title", e.target.value)}
        placeholder="Title"
      />
      <Textarea
        value={section.description || ""}
        onChange={(e) => updateSection(type, index, "description", e.target.value)}
        placeholder="Description"
      />
      <Input
        value={section.name || ""}
        onChange={(e) => updateSection(type, index, "name", e.target.value)}
        placeholder="Name"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(type, index, e)} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {section.image && <img src={section.image || "/placeholder.svg"} alt="Section" className="mt-2 max-w-xs" />}
      </div>
      <Input
        value={section.linkText || ""}
        onChange={(e) => updateSection(type, index, "linkText", e.target.value)}
        placeholder="Link Text"
      />
      <Input
        value={section.linkUrl || ""}
        onChange={(e) => updateSection(type, index, "linkUrl", e.target.value)}
        placeholder="Link URL"
      />
      <Input
        type="number"
        value={section.order}
        onChange={(e) => updateSection(type, index, "order", Number.parseInt(e.target.value))}
        placeholder="Order"
      />
      <div>
        <h4 className="font-semibold mb-2">Images</h4>
        {section.images.map((image, imageIndex) => (
          <div key={imageIndex} className="border p-2 rounded mb-2">
            <Input
              value={image.src}
              onChange={(e) => updateImage(type, index, imageIndex, "src", e.target.value)}
              placeholder="Image URL"
              className="mb-1"
            />
            <Input
              value={image.alt}
              onChange={(e) => updateImage(type, index, imageIndex, "alt", e.target.value)}
              placeholder="Alt Text"
              className="mb-1"
            />
            <Input
              value={image.desc}
              onChange={(e) => updateImage(type, index, imageIndex, "desc", e.target.value)}
              placeholder="Description"
              className="mb-1"
            />
            <Button type="button" onClick={() => removeImage(type, index, imageIndex)} variant="destructive" size="sm">
              Remove Image
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => addImage(type, index)} size="sm">
          Add Image
        </Button>
      </div>
      {type !== "banner" && (
        <Button
          type="button"
          onClick={() => removeSection(type as "sections" | "collections", index)}
          variant="destructive"
        >
          Remove Section
        </Button>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Banner</h2>
        {bathroomData.banner && renderSectionForm("banner", bathroomData.banner, 0)}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sections</h2>
        {bathroomData.sections.map((section, index) => renderSectionForm("sections", section, index))}
        <Button type="button" onClick={() => addSection("sections")}>
          Add Section
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Collections</h2>
        {bathroomData.collections.map((collection, index) => renderSectionForm("collections", collection, index))}
        <Button type="button" onClick={() => addSection("collections")}>
          Add Collection
        </Button>
      </div>

      <Button type="submit">Save Bathroom Page</Button>
    </form>
  );
}
