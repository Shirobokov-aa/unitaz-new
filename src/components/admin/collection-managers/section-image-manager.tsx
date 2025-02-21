"use client";

// import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Конфигурация размеров изображений для разных типов секций
const SECTION_IMAGE_CONFIG = {
  section: [
    { width: 520, height: 518, label: "Основное изображение" },
    { width: 250, height: 250, label: "Дополнительное изображение 1" },
    { width: 250, height: 250, label: "Дополнительное изображение 2" }
  ],
  section2: [{ width: 520, height: 700, label: "Основное изображение" }],
  section3: [{ width: 520, height: 800, label: "Основное изображение" }],
  section4: [
    { width: 434, height: 434, label: "Изображение 1" },
    { width: 434, height: 434, label: "Изображение 2" },
    { width: 434, height: 434, label: "Изображение 3" }
  ]
} as const;

interface SectionImageManagerProps {
  type: keyof typeof SECTION_IMAGE_CONFIG;
  images: { src: string; alt: string }[];
  onChange: (images: { src: string; alt: string }[]) => void;
}

export function SectionImageManager({ type, images, onChange }: SectionImageManagerProps) {
  const config = SECTION_IMAGE_CONFIG[type];

  const handleFileUpload = (index: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[index] = {
        src: reader.result as string,
        alt: file.name
      };
      onChange(newImages);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Изображения секции</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.map((imageConfig, index) => (
          <div key={index} className="border p-4 rounded">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {imageConfig.label} ({imageConfig.width}x{imageConfig.height})
              </label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(index, file);
                }}
              />

              {images[index]?.src && (
                <div className="relative mt-2">
                  <Image
                    src={images[index].src}
                    alt={images[index].alt}
                    width={imageConfig.width}
                    height={imageConfig.height}
                    className="object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const newImages = [...images];
                      newImages[index] = { src: "", alt: "" };
                      onChange(newImages);
                    }}
                  >
                    Удалить
                  </Button>
                </div>
              )}

              <Input
                placeholder="Альтернативный текст"
                value={images[index]?.alt || ""}
                onChange={(e) => {
                  const newImages = [...images];
                  if (!newImages[index]) {
                    newImages[index] = { src: "", alt: e.target.value };
                  } else {
                    newImages[index].alt = e.target.value;
                  }
                  onChange(newImages);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
