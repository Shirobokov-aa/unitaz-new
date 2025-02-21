"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { CollectionPreview } from "@/lib/db/schema";
import { saveCollectionPreviews } from "@/actions/inserts"; // Добавлен импорт функции сохранения

interface CollectionPreviewManagerProps {
  initialData: CollectionPreview[];
}

type NewCollectionPreview = Omit<CollectionPreview, "id"> & { id: number }; // Добавлен тип для нового превью

export function CollectionPreviewManager({ initialData }: CollectionPreviewManagerProps) {
  const [previews, setPreviews] = useState<CollectionPreview[]>(initialData || []);
  const [selectedPreview, setSelectedPreview] = useState<CollectionPreview | null>(null);
  const router = useRouter();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (selectedPreview) {
            const newImage = reader.result as string;
            setPreviews(prev =>
              prev.map(p =>
                p.id === selectedPreview.id
                  ? { ...p, image: newImage }
                  : p
              )
            );
            setSelectedPreview(prev => prev ? { ...prev, image: newImage } : null); // Обновляем выбранное превью
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [selectedPreview]
  );

  const updatePreview = useCallback((field: keyof CollectionPreview, value: string) => {
    if (selectedPreview) {
      setPreviews(prev =>
        prev.map(p =>
          p.id === selectedPreview.id
            ? { ...p, [field]: value }
            : p
        )
      );
      setSelectedPreview(prev => prev ? { ...prev, [field]: value } : null);
    }
  }, [selectedPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await saveCollectionPreviews(previews);
      if (result.success) {
        toast({ title: "Успех", description: result.message });
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Ошибка сохранения превью:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить превью коллекций",
        variant: "destructive"
      });
    }
  };

  const addNewPreview = useCallback(() => {
    // Находим максимальный id среди существующих превью
    const maxId = previews.reduce((max, preview) =>
      Math.max(max, preview.id), 0);

    const newPreview: NewCollectionPreview = {
      id: maxId + 1, // Используем следующий id после максимального
      image: '',
      title: 'Новая коллекция',
      desc: '',
      link: '',
      flexDirection: 'xl:flex-row' as const
    };
    setPreviews(prev => [...prev, newPreview]);
    setSelectedPreview(newPreview);
  }, [previews]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-1/3 space-y-4">
          <h2 className="text-xl font-semibold">Список превью</h2>
          <div className="space-y-2">
            {previews.map(preview => (
              <div
                key={preview.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedPreview?.id === preview.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedPreview(preview)}
              >
                {preview.title || 'Без названия'}
              </div>
            ))}
          </div>
          <Button onClick={addNewPreview}>
            Добавить превью
          </Button>
        </div>

        {selectedPreview && (
          <form onSubmit={handleSubmit} className="w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Изображение</label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {selectedPreview.image && (
                <img
                  src={selectedPreview.image}
                  alt="Preview"
                  className="mt-2 max-w-xs object-contain"
                />
              )}
            </div>

            <Input
              value={selectedPreview.title}
              onChange={(e) => updatePreview("title", e.target.value)}
              placeholder="Название коллекции"
            />

            <Textarea
              value={selectedPreview.desc}
              onChange={(e) => updatePreview("desc", e.target.value)}
              placeholder="Описание коллекции"
            />

            <Input
              value={selectedPreview.link}
              onChange={(e) => updatePreview("link", e.target.value)}
              placeholder="Ссылка"
            />

            <Select
              value={selectedPreview.flexDirection}
              onValueChange={(value: 'xl:flex-row' | 'xl:flex-row-reverse') =>
                updatePreview("flexDirection", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите направление" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xl:flex-row">Слева направо</SelectItem>
                <SelectItem value="xl:flex-row-reverse">Справа налево</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button type="submit">Сохранить</Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setPreviews(prev => prev.filter(p => p.id !== selectedPreview.id));
                  setSelectedPreview(null);
                }}
              >
                Удалить
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
