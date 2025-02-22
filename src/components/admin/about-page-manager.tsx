/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { useState, useCallback } from "react";
import type { AboutPage } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { saveAboutPage } from "@/actions/inserts";

interface AboutPageManagerProps {
  initialData: AboutPage | undefined;
}

export function AboutPageManager({ initialData }: AboutPageManagerProps) {
  const [aboutData, setAboutData] = useState<AboutPage>(
    initialData || {
      id: 0,
      bannerName: "",
      bannerImage: "",
      bannerTitle: "",
      bannerDescription: "",
      bannerLink: { text: "", url: "" },
      sections: [],
    }
  );
  const router = useRouter();

  const updateField = useCallback((field: keyof AboutPage, value: unknown) => {
    setAboutData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateBannerLink = useCallback((field: "text" | "url", value: string) => {
    setAboutData((prev) => ({
      ...prev,
      bannerLink: { ...prev.bannerLink, [field]: value },
    }));
  }, []);

  const addSection = useCallback(() => {
    setAboutData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", description: "" }],
    }));
  }, []);

  const updateSection = useCallback((index: number, field: "title" | "description", value: string) => {
    setAboutData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) => (i === index ? { ...section, [field]: value } : section)),
    }));
  }, []);

  const removeSection = useCallback((index: number) => {
    setAboutData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }, []);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          updateField("bannerImage", base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    [updateField]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAboutPage(aboutData);
      toast({ title: "Success", description: "About page saved successfully" });
      router.refresh();
    } catch (error) {
      console.error("Error saving about page:", error);
      toast({ title: "Error", description: "Failed to save about page", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          value={aboutData.bannerName}
          onChange={(e) => updateField("bannerName", e.target.value)}
          placeholder="Banner Name"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">Баннер</label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {aboutData.bannerImage && (
            <img src={aboutData.bannerImage || "/placeholder.svg"} alt="Banner" className="mt-2 max-w-xs" />
          )}
        </div>
        <Input
          value={aboutData.bannerTitle}
          onChange={(e) => updateField("bannerTitle", e.target.value)}
          placeholder="Banner Title"
        />
        <Textarea
          value={aboutData.bannerDescription}
          onChange={(e) => updateField("bannerDescription", e.target.value)}
          placeholder="Banner Description"
        />
        <div className="space-y-2">
          <Input
            value={aboutData.bannerLink.text}
            onChange={(e) => updateBannerLink("text", e.target.value)}
            placeholder="Banner Link Text"
          />
          <Input
            value={aboutData.bannerLink.url}
            onChange={(e) => updateBannerLink("url", e.target.value)}
            placeholder="Banner Link URL"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Секция</h2>
        {aboutData.sections.map((section, index) => (
          <div key={index} className="space-y-2 p-4 border rounded">
            <Input
              value={section.title}
              onChange={(e) => updateSection(index, "title", e.target.value)}
              placeholder="Section Title"
            />
            <Textarea
              value={section.description}
              onChange={(e) => updateSection(index, "description", e.target.value)}
              placeholder="Section Description"
            />
            <Button type="button" onClick={() => removeSection(index)} variant="destructive">
              Удалить секцию
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addSection}>
          Добавить секцию
        </Button>
      </div>

      <Button type="submit">Сохранить</Button>
    </form>
  );
}
