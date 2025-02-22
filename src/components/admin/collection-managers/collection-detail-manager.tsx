"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { Collection, CollectionSection } from "@/lib/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveCollection } from "@/actions/inserts";
import { SectionImageManager } from "../collection-managers/section-image-manager";
import Image from "next/image";

type SectionImage = {
  src: string;
  alt: string;
};

type SectionType = "section" | "section2" | "section3" | "section4";

type SectionField = string | SectionImage[] | SectionType;

interface CollectionDetailManagerProps {
  initialData: Collection & { sections: CollectionSection[] };
}

export function CollectionDetailManager({ initialData }: CollectionDetailManagerProps) {
  const [collection, setCollection] = useState<Collection>(initialData);
  const [sections, setSections] = useState<CollectionSection[]>(initialData.sections);
  const router = useRouter();

  // Обработчик загрузки изображения
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setCollection((prev) => ({
        ...prev,
        bannerImage: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Обработчик обновления коллекции
  const updateCollection = useCallback((field: keyof Collection, value: string) => {
    setCollection((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Обработчик добавления секции
  const addSection = useCallback(() => {
    const newSection: Omit<CollectionSection, "id"> & { id: number } = {
      id: Date.now(),
      collectionId: collection.id,
      type: "section" as SectionType,
      title: "",
      description: "",
      linkText: "",
      linkUrl: "",
      titleDesc: "",
      descriptionDesc: "",
      images: [] as SectionImage[],
      order: sections.length,
      createdAt: new Date(), // Добавляем поле createdAt
      updatedAt: new Date(), // Добавляем поле updatedAt
    };
    setSections((prev) => [...prev, newSection as CollectionSection]);
  }, [collection.id, sections.length]);

  // Обработчик обновления секции
  const updateSection = useCallback((index: number, field: keyof CollectionSection, value: SectionField) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, [field]: value, updatedAt: new Date() } : section))
    );
  }, []);

  // Обработчик удаления секции
  const removeSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Проверяем корректность данных изображений
      const validSections = sections.map((section) => ({
        ...section,
        images: Array.isArray(section.images) ? section.images : [],
      }));

      const result = await saveCollection({
        ...collection,
        sections: validSections,
      });

      if (result.success) {
        toast({ title: "Успех", description: "Коллекция сохранена" });
        router.refresh();
      } else {
        throw new Error(result.message || "Ошибка сохранения");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      console.error("Ошибка сохранения коллекции:", errorMessage);
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить коллекцию: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Баннер коллекции */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Информация о коллекции</h2>
        <Input
          value={collection.name}
          onChange={(e) => updateCollection("name", e.target.value)}
          placeholder="Название коллекции"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Баннер</label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {collection.bannerImage && (
            <Image
              src={collection.bannerImage}
              alt="Banner"
              width={500}
              height={300}
              className="mt-2 max-w-xs object-contain"
              unoptimized // Добавляем это свойство, так как используем base64
            />
          )}
        </div>

        <Input
          value={collection.bannerTitle ?? ""}
          onChange={(e) => updateCollection("bannerTitle", e.target.value)}
          placeholder="Заголовок баннера"
        />

        <Textarea
          value={collection.bannerDescription ?? ""}
          onChange={(e) => updateCollection("bannerDescription", e.target.value)}
          placeholder="Описание баннера"
        />

        <Input
          value={collection.bannerLinkText ?? ""}
          onChange={(e) => updateCollection("bannerLinkText", e.target.value)}
          placeholder="Текст ссылки"
        />

        <Input
          value={collection.bannerLinkUrl ?? ""}
          onChange={(e) => updateCollection("bannerLinkUrl", e.target.value)}
          placeholder="URL ссылки"
        />
      </div>

      {/* Секции */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Секции</h2>
        {sections.map((section, index) => (
          <div key={section.id} className="p-4 border rounded space-y-4">
            <Select value={section.type} onValueChange={(value: SectionType) => updateSection(index, "type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип секции" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="section">Секция 1</SelectItem>
                <SelectItem value="section2">Секция 2</SelectItem>
                <SelectItem value="section3">Секция 3</SelectItem>
                <SelectItem value="section4">Секция 4</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={section.title}
              onChange={(e) => updateSection(index, "title", e.target.value)}
              placeholder="Заголовок секции"
            />

            <Textarea
              value={section.description}
              onChange={(e) => updateSection(index, "description", e.target.value)}
              placeholder="Описание секции"
            />

            <Input
              value={section.titleDesc ?? ""}
              onChange={(e) => updateSection(index, "titleDesc", e.target.value)}
              placeholder="Заголовок описания"
            />

            <Textarea
              value={section.descriptionDesc ?? ""}
              onChange={(e) => updateSection(index, "descriptionDesc", e.target.value)}
              placeholder="Дополнительное описание"
            />

            <Input
              value={section.linkText ?? ""}
              onChange={(e) => updateSection(index, "linkText", e.target.value)}
              placeholder="Текст ссылки"
            />

            <Input
              value={section.linkUrl ?? ""}
              onChange={(e) => updateSection(index, "linkUrl", e.target.value)}
              placeholder="URL ссылки"
            />

            <SectionImageManager
              type={section.type}
              images={(section.images as SectionImage[]) ?? []}
              onChange={(newImages: SectionImage[]) => {
                updateSection(index, "images", newImages);
              }}
            />

            <Button type="button" variant="destructive" onClick={() => removeSection(index)}>
              Удалить секцию
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addSection}>
          Добавить секцию
        </Button>
      </div>

      <Button type="submit">Сохранить коллекцию</Button>
    </form>
  );
}
