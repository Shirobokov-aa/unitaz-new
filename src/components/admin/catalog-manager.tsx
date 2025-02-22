"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { saveCatalogProduct, deleteCatalogProduct } from "@/actions/inserts";
import type { CatalogProduct, CategoryWithSubCategories } from "@/lib/db/schema";

interface CatalogManagerProps {
  initialProducts: CatalogProduct[];
  categories: CategoryWithSubCategories[];
}

export function CatalogManager({ initialProducts, categories }: CatalogManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const handleImageUpload = async (productIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const updatedProducts = [...products];
    const product = updatedProducts[productIndex];

    for (const file of files) {
      try {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        product.images.push(reader.result as string);
      } catch (error) {
        console.error("Ошибка при загрузке изображения:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить изображение",
          variant: "destructive",
        });
      }
    }

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: 0,
        name: "",
        article: "",
        price: 0,
        description: "",
        images: [],
        colors: [],
        characteristics: [],
        technicalDocs: [],
        categoryId: null,
        subCategoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  const removeProduct = async (index: number) => {
    const product = products[index];
    if (product.id) {
      const result = await deleteCatalogProduct(product.id);
      if (!result.success) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить товар",
          variant: "destructive",
        });
        return;
      }
    }
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const updateProduct = (index: number, field: keyof CatalogProduct, value: string | number | null) => {
    const updatedProducts = [...products];
    if (field === 'price') {
      const priceValue = parseInt(value as string);
      if (!isNaN(priceValue) && priceValue >= 0 && priceValue <= 2147483647) {
        updatedProducts[index] = { ...updatedProducts[index], [field]: priceValue };
        setProducts(updatedProducts);
      }
    } else {
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
      setProducts(updatedProducts);
    }
  };

  const addColor = (productIndex: number) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].colors.push({ name: "", code: "" });
    setProducts(updatedProducts);
  };

  const removeColor = (productIndex: number, colorIndex: number) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].colors.splice(colorIndex, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const product of products) {
      const result = await saveCatalogProduct(product);
      if (!result.success) {
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить товар",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Успех",
      description: "Товары сохранены",
    });

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {products.map((product, productIndex) => (
        <div key={productIndex} className="border p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Товар {productIndex + 1}</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/catalog/${product.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать детали
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeProduct(productIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Название"
              value={product.name}
              onChange={(e) => updateProduct(productIndex, "name", e.target.value)}
            />
            <Input
              placeholder="Артикул"
              value={product.article}
              onChange={(e) => updateProduct(productIndex, "article", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Цена"
              min={0}
              max={2147483647}
              value={product.price}
              onChange={(e) => updateProduct(productIndex, "price", e.target.value)}
            />
            <Select
              value={product.categoryId?.toString()}
              onValueChange={(value) => updateProduct(productIndex, "categoryId", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Описание"
            value={product.description || ""}
            onChange={(e) => updateProduct(productIndex, "description", e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Изображения</label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(productIndex, e)}
                className="hidden"
                id={`product-image-${productIndex}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`product-image-${productIndex}`)?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Загрузить изображения
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, imageIndex) => (
                <div key={imageIndex} className="relative group">
                  <Image
                    src={image}
                    alt={`Product ${productIndex + 1} image ${imageIndex + 1}`}
                    width={200}
                    height={200}
                    className="rounded object-cover w-full h-32"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      const updatedProducts = [...products];
                      updatedProducts[productIndex].images.splice(imageIndex, 1);
                      setProducts(updatedProducts);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Цвета</label>
              <Button type="button" variant="outline" onClick={() => addColor(productIndex)}>
                <Plus className="h-4 w-4 mr-2" /> Добавить цвет
              </Button>
            </div>
            {product.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="flex gap-2">
                <Input
                  placeholder="Название цвета"
                  value={color.name}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[productIndex].colors[colorIndex].name = e.target.value;
                    setProducts(updatedProducts);
                  }}
                />
                <Input
                  placeholder="Код цвета"
                  value={color.code}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[productIndex].colors[colorIndex].code = e.target.value;
                    setProducts(updatedProducts);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeColor(productIndex, colorIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button type="button" onClick={addProduct}>
          <Plus className="h-4 w-4 mr-2" /> Добавить товар
        </Button>
        <Button type="submit">Сохранить изменения</Button>
      </div>
    </form>
  );
}
