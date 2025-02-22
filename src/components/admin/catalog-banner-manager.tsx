"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { saveCatalogBanner } from "@/actions/inserts";
import type { CatalogBanner } from "@/lib/db/schema";

interface CatalogBannerManagerProps {
  initialBanner?: CatalogBanner;
}

export function CatalogBannerManager({ initialBanner }: CatalogBannerManagerProps) {
  const [banner, setBanner] = useState<Partial<CatalogBanner>>(initialBanner || {
    name: "",
    image: "",
    title: "",
    description: "",
    linkText: "",
    linkUrl: "",
  });
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setBanner({ ...banner, image: reader.result as string });
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await saveCatalogBanner(banner as Required<Omit<CatalogBanner, 'id' | 'createdAt' | 'updatedAt'>>);

    if (result.success) {
      toast({
        title: "Успех",
        description: "Баннер сохранен",
      });
      router.refresh();
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить баннер",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold mb-4">Баннер каталога</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Название"
            value={banner.name}
            onChange={(e) => setBanner({ ...banner, name: e.target.value })}
          />
          <Input
            placeholder="Заголовок"
            value={banner.title}
            onChange={(e) => setBanner({ ...banner, title: e.target.value })}
          />
        </div>

        <Textarea
          placeholder="Описание"
          value={banner.description || ""}
          onChange={(e) => setBanner({ ...banner, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Текст ссылки"
            value={banner.linkText || ""}
            onChange={(e) => setBanner({ ...banner, linkText: e.target.value })}
          />
          <Input
            placeholder="URL ссылки"
            value={banner.linkUrl || ""}
            onChange={(e) => setBanner({ ...banner, linkUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Изображение баннера</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="banner-image"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("banner-image")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Загрузить изображение
            </Button>
          </div>
          {banner.image && (
            <div className="mt-4">
              <Image
                src={banner.image}
                alt="Banner preview"
                width={400}
                height={200}
                className="rounded object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <Button type="submit">Сохранить изменения</Button>
    </form>
  );
}
