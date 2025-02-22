"use client";

import type React from "react";

import { useState } from "react";
import type { CategoryWithSubCategories, SubCategory } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { saveCategories } from "@/actions/inserts";

interface CategoryManagerProps {
  initialCategories: CategoryWithSubCategories[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryWithSubCategories[]>(initialCategories);
  const router = useRouter();

  const addCategory = () => {
    setCategories([
      ...categories,
      { id: 0, name: "", images: [], subCategories: [], createdAt: new Date(), updatedAt: new Date() },
    ]);
  };

  const updateCategory = (index: number, field: keyof CategoryWithSubCategories, value: unknown) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setCategories(updatedCategories);
  };

  const addSubCategory = (categoryIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subCategories.push({ id: 0, name: "", href: "", categoryId: null });
    setCategories(updatedCategories);
  };

  const updateSubCategory = (
    categoryIndex: number,
    subCategoryIndex: number,
    field: keyof SubCategory,
    value: string
  ) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subCategories[subCategoryIndex] = {
      ...updatedCategories[categoryIndex].subCategories[subCategoryIndex],
      [field]: value,
    };
    setCategories(updatedCategories);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const removeSubCategory = (categoryIndex: number, subCategoryIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subCategories = updatedCategories[categoryIndex].subCategories.filter(
      (_, i) => i !== subCategoryIndex
    );
    setCategories(updatedCategories);
  };

  const handleImageUpload = async (categoryIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const updatedCategories = [...categories];
    const category = updatedCategories[categoryIndex];

    for (const file of files) {
      try {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const imageUrl = reader.result as string;
        category.images.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить изображение",
          variant: "destructive",
        });
      }
    }

    setCategories(updatedCategories);
  };

  const removeImage = (categoryIndex: number, imageIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].images.splice(imageIndex, 1);
    setCategories(updatedCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await saveCategories(categories);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error saving categories:", error);
      toast({
        title: "Error",
        description: "Failed to save categories and subcategories",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {categories.map((category, categoryIndex) => (
        <div key={category.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex items-center gap-4">
            <Input
              value={category.name}
              onChange={(e) => updateCategory(categoryIndex, "name", e.target.value)}
              placeholder="Название категории"
              className="flex-grow"
            />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeCategory(categoryIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(categoryIndex, e)}
                className="hidden"
                id={`category-image-${categoryIndex}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`category-image-${categoryIndex}`)?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Загрузить изображения
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {category.images.map((image, imageIndex) => (
                <div key={imageIndex} className="relative group">
                  <Image
                    src={image}
                    alt={`Category image ${imageIndex + 1}`}
                    width={200}
                    height={200}
                    className="rounded object-cover w-full h-32"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(categoryIndex, imageIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="pl-4 space-y-2">
            {category.subCategories.map((subCategory, subIndex) => (
              <div key={subIndex} className="flex gap-2">
                <Input
                  value={subCategory.name}
                  onChange={(e) => updateSubCategory(categoryIndex, subIndex, "name", e.target.value)}
                  placeholder="Название подкатегории"
                />
                <Input
                  value={subCategory.href}
                  onChange={(e) => updateSubCategory(categoryIndex, subIndex, "href", e.target.value)}
                  placeholder="Ссылка"
                />
                <Button
                  className="w-20 h-10"
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSubCategory(categoryIndex, subIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addSubCategory(categoryIndex)}>
              <Plus className="h-4 w-4 mr-2" /> Добавить подкатегорию
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <Button type="button" onClick={addCategory}>
          <Plus className="h-4 w-4 mr-2" /> Добавить категорию
        </Button>
        <Button type="submit">Сохранить изменения</Button>
      </div>
    </form>
  );
}
