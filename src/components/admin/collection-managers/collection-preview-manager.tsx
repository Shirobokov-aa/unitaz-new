"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { CollectionPreview } from "@/lib/db/schema";
import { saveCollectionPreviews } from "@/actions/inserts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionPreviewManagerProps {
  initialData: CollectionPreview[];
}

export function CollectionPreviewManager({ initialData }: CollectionPreviewManagerProps) {
  const [previews, setPreviews] = useState<CollectionPreview[]>(initialData || []);
  const [selectedPreview, setSelectedPreview] = useState<CollectionPreview | null>(null);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Функция обновления превью
  const updatePreview = useCallback((updatedPreview: CollectionPreview) => {
    setPreviews(prev =>
      prev.map(p => p.id === updatedPreview.id ? updatedPreview : p)
    );
    setSelectedPreview(updatedPreview);
  }, []);

  // Функция для создания нового превью
  const addNewPreview = useCallback(() => {
    const maxId = previews.reduce((max, preview) => Math.max(max, preview.id), 0);
    const newPreview: CollectionPreview = {
      id: maxId + 1,
      image: '',
      title: 'Новая коллекция',
      desc: '',
      link: '',
      flexDirection: 'xl:flex-row'
    };
    setPreviews(prev => [...prev, newPreview]);
    setSelectedPreview(newPreview);
  }, [previews]);

  // Обработчик сохранения превью
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPreview) return;

    setIsSubmitting(true);
    try {
      const updatedPreviews = previews.map(p =>
        p.id === selectedPreview.id ? selectedPreview : p
      );

      const result = await saveCollectionPreviews(updatedPreviews);

      if (result.success) {
        setPreviews(updatedPreviews);
        toast({
          title: "Успех",
          description: "Превью и шаблон коллекции сохранены"
        });

        // Добавляем небольшую задержку перед обновлением страницы
        setTimeout(() => {
          router.refresh();
        }, 500);

        // Сбрасываем выбранное превью
        setSelectedPreview(null);
      } else {
        throw new Error(result.message || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сохранить данные",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Список превью */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Список превью</h2>
          <Button onClick={addNewPreview}>Добавить превью</Button>
        </div>

        <div className="space-y-2">
          {previews.map(preview => (
            <div
              key={preview.id}
              className={`p-4 border rounded hover:bg-gray-50 ${
                selectedPreview?.id === preview.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <h3 className="font-medium">{preview.title}</h3>
              <p className="text-sm text-gray-600">{preview.desc}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPreview(preview)}
                >
                  Редактировать
                </Button>
                <Button asChild variant="secondary">
                  <Link href={`/admin/collections/edit/${preview.id}`}>
                    Детальная информация
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Форма редактирования */}
      {selectedPreview && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded sticky top-4">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPreview.id ? 'Редактирование превью' : 'Новое превью'}
          </h2>

          <div className="space-y-4">

          <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Изображение
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                updatePreview({
                  ...selectedPreview,
                  image: reader.result as string
                });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {selectedPreview.image && (
          <div className="mt-2">
            <img
              src={selectedPreview.image}
              alt="Preview"
              className="max-w-xs h-auto rounded"
            />
          </div>
        )}
      </div>

            <Input
              value={selectedPreview.title}
              onChange={(e) => updatePreview({ ...selectedPreview, title: e.target.value })}
              placeholder="Название коллекции"
            />

            <Textarea
              value={selectedPreview.desc}
              onChange={(e) => updatePreview({ ...selectedPreview, desc: e.target.value })}
              placeholder="Описание"
            />

            <Input
              value={selectedPreview.link}
              onChange={(e) => updatePreview({ ...selectedPreview, link: e.target.value })}
              placeholder="Ссылка"
            />
          </div>

                {/* Селект для выбора направления */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Направление флекса
        </label>
        <Select
          value={selectedPreview.flexDirection}
          onValueChange={(value: "xl:flex-row" | "xl:flex-row-reverse") =>
            updatePreview({ ...selectedPreview, flexDirection: value })
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
      </div>


          <div className="flex gap-2">
          <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Сохранение..." : "Сохранить"}
      </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setSelectedPreview(null)}
            >
              Отмена
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
