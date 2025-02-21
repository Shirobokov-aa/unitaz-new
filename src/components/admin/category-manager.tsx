"use client";

import type React from "react";

import { useState } from "react";
import type { CategoryWithSubCategories, SubCategory } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
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
              placeholder="Category Name"
              className="flex-grow"
            />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeCategory(categoryIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="pl-4 space-y-2">
            {category.subCategories.map((subCategory, subCategoryIndex) => (
              <div key={subCategory.id} className="flex items-center gap-2">
                <Input
                  value={subCategory.name}
                  onChange={(e) => updateSubCategory(categoryIndex, subCategoryIndex, "name", e.target.value)}
                  placeholder="Subcategory Name"
                  className="flex-grow"
                />
                <Input
                  value={subCategory.href}
                  onChange={(e) => updateSubCategory(categoryIndex, subCategoryIndex, "href", e.target.value)}
                  placeholder="Subcategory Href"
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSubCategory(categoryIndex, subCategoryIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addSubCategory(categoryIndex)}>
              <Plus className="h-4 w-4 mr-2" /> Add Subcategory
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <Button type="button" onClick={addCategory}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
