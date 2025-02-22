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
import Image from "next/image";

type SectionType = "banner" | "sections" | "collections";

interface ImageType {
  src: string;
  alt: string;
  desc: string;
}

interface BathroomPageData {
  banner: BathroomSection | undefined;
  sections: BathroomSection[];
  collections: BathroomSection[];
}

interface BathroomPageManagerProps {
  initialData: BathroomPageData;
}

export function BathroomPageManager({ initialData }: BathroomPageManagerProps) {
  const [bathroomData, setBathroomData] = useState<BathroomPageData>(initialData);
  const router = useRouter();

  const addBanner = useCallback(() => {
    setBathroomData((prev) => ({
      ...prev,
      banner: {
        id: 0,
        section: "banner",
        title: "",
        description: "",
        name: "",
        image: "",
        images: [],
        linkText: "",
        linkUrl: "",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));
  }, []);

  const updateSection = useCallback(
    (type: SectionType, index: number, field: keyof BathroomSection, value: string | number | ImageType[]) => {
      setBathroomData((prev) => {
        if (type === "banner" && prev.banner) {
          return {
            ...prev,
            banner: {
              ...prev.banner,
              [field]: value,
              updatedAt: new Date(),
            },
          };
        } else if (type === "sections" || type === "collections") {
          const newData = { ...prev };
          const sectionArray = newData[type];
          if (sectionArray[index]) {
            sectionArray[index] = {
              ...sectionArray[index],
              [field]: value,
              updatedAt: new Date(),
            };
          }
          return newData;
        }
        return prev;
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
          section: type === "sections" ? "section" : "collection",
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
    async (type: SectionType, sectionIndex: number, imageIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, выберите изображение",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBathroomData((prev) => {
          if (type === "banner" && prev.banner) {
            return {
              ...prev,
              banner: {
                ...prev.banner,
                image: result,
                updatedAt: new Date(),
              },
            };
          } else if (type === "sections" || type === "collections") {
            const newData = { ...prev };
            const section = newData[type][sectionIndex];
            if (section) {
              section.images = section.images || [];
              section.images[imageIndex] = {
                src: result,
                alt: section.title || `Image ${imageIndex + 1}`,
                desc: "",
              };
              section.updatedAt = new Date();
            }
            return newData;
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    },
    []
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

      {type === "banner" ? (
        <div>
          <h4 className="font-semibold mb-2">Изображение баннера</h4>
          <div className="space-y-4">
            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(type, index, 0, e)} />
            {section.image && (
              <div className="relative mt-2 h-40">
                <Image
                  src={section.image}
                  alt={section.title || "Banner image"}
                  fill
                  className="object-contain rounded"
                  unoptimized={section.image.startsWith("data:")}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h4 className="font-semibold mb-2">Изображения</h4>
          <div className="space-y-4">
            {section.images?.map((image, imageIndex) => (
              <div key={imageIndex} className="border p-4 rounded">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Изображение {imageIndex + 1}</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(type, index, imageIndex, e)}
                    />
                    {image.src && (
                      <div className="relative mt-2 h-40">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-contain rounded"
                          unoptimized={image.src.startsWith("data:")}
                        />
                      </div>
                    )}
                  </div>

                  <Input
                    value={image.alt}
                    onChange={(e) => updateImage(type, index, imageIndex, "alt", e.target.value)}
                    placeholder="Alt текст"
                  />

                  <Input
                    value={image.desc}
                    onChange={(e) => updateImage(type, index, imageIndex, "desc", e.target.value)}
                    placeholder="Описание"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(type, index, imageIndex)}
                  >
                    Удалить изображение
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" onClick={() => addImage(type, index)} className="w-full">
              Добавить изображение
            </Button>
          </div>
        </div>
      )}

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
        {bathroomData.banner ? (
          renderSectionForm("banner", bathroomData.banner, 0)
        ) : (
          <Button type="button" onClick={addBanner}>
            Add Banner
          </Button>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sections ({bathroomData.sections.length})</h2>
        {bathroomData.sections.map((section, index) => renderSectionForm("sections", section, index))}
        <Button type="button" onClick={() => addSection("sections")}>
          Add Section
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Collections ({bathroomData.collections.length})</h2>
        {bathroomData.collections.map((collection, index) => renderSectionForm("collections", collection, index))}
        <Button type="button" onClick={() => addSection("collections")}>
          Add Collection
        </Button>
      </div>

      <Button type="submit">Save Bathroom Page</Button>
    </form>
  );
}
