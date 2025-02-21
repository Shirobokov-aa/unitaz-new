"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { Collection, CollectionSection } from "@/lib/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CollectionDetailManagerProps {
  initialData: Collection & { sections: CollectionSection[] };
}

export function CollectionDetailManager({ initialData }: CollectionDetailManagerProps) {
  const [collection, setCollection] = useState(initialData);
  const [sections, setSections] = useState(initialData.sections);
  const router = useRouter();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCollection(prev => ({
            ...prev,
            bannerImage: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const updateCollection = useCallback((field: keyof Collection, value: string) => {
    setCollection(prev => ({ ...prev, [field]: value }));
  }, []);

  const addSection = useCallback(() => {
    const newSection: CollectionSection = {
      id: Date.now(),
      collectionId: collection.id,
      type: "section",
      title: "",
      description: "",
      linkText: "",
      linkUrl: "",
      titleDesc: "",
      descriptionDesc: "",
      images: [],
      order: sections.length,
    };
    setSections(prev => [...prev, newSection]);
  }, [collection.id, sections.length]);

  const updateSection = useCallback((index: number, field: keyof CollectionSection, value: any) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  }, []);

  const removeSection = useCallback((index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Добавить функцию сохранения в actions/inserts.ts
      await saveCollection({ ...collection, sections });
      toast({ title: "Успех", description: "Коллекция сохранена" });
      router.refresh();
    } catch (error) {
      console.error("Ошибка сохранения коллекции:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить коллекцию",
        variant: "destructive"
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
            <img
              src={collection.bannerImage}
              alt="Banner"
              className="mt-2 max-w-xs object-contain"
            />
          )}
        </div>

        <Input
          value={collection.bannerTitle}
          onChange={(e) => updateCollection("bannerTitle", e.target.value)}
          placeholder="Заголовок баннера"
        />

        <Textarea
          value={collection.bannerDescription}
          onChange={(e) => updateCollection("bannerDescription", e.target.value)}
          placeholder="Описание баннера"
        />

        <Input
          value={collection.bannerLinkText}
          onChange={(e) => updateCollection("bannerLinkText", e.target.value)}
          placeholder="Текст ссылки"
        />

        <Input
          value={collection.bannerLinkUrl}
          onChange={(e) => updateCollection("bannerLinkUrl", e.target.value)}
          placeholder="URL ссылки"
        />
      </div>

      {/* Секции */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Секции</h2>
        {sections.map((section, index) => (
          <div key={section.id} className="p-4 border rounded space-y-4">
            <Select
              value={section.type}
              onValueChange={(value: "section" | "section2" | "section3" | "section4") =>
                updateSection(index, "type", value)
              }
            >
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
              value={section.titleDesc}
              onChange={(e) => updateSection(index, "titleDesc", e.target.value)}
              placeholder="Заголовок описания"
            />

            <Textarea
              value={section.descriptionDesc}
              onChange={(e) => updateSection(index, "descriptionDesc", e.target.value)}
              placeholder="Дополнительное описание"
            />

            <Input
              value={section.linkText}
              onChange={(e) => updateSection(index, "linkText", e.target.value)}
              placeholder="Текст ссылки"
            />

            <Input
              value={section.linkUrl}
              onChange={(e) => updateSection(index, "linkUrl", e.target.value)}
              placeholder="URL ссылки"
            />

            <Button
              type="button"
              variant="destructive"
              onClick={() => removeSection(index)}
            >
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
