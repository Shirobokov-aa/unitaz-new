"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { saveCatalogProduct } from "@/actions/inserts";
import type { CatalogProduct, CategoryWithSubCategories } from "@/lib/db/schema";

interface ProductEditorProps {
  initialProduct: CatalogProduct;
  categories: CategoryWithSubCategories[];
}

export function ProductEditor({ initialProduct, categories }: ProductEditorProps) {
  const [product, setProduct] = useState(initialProduct);
  const router = useRouter();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 2147483647) {
      setProduct({ ...product, price: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const newImages = [...product.images];

      for (const file of files) {
        const reader = new FileReader();
        const imageDataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newImages.push(imageDataUrl);
      }

      setProduct({ ...product, images: newImages });
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    }
  };

  const addCharacteristic = () => {
    setProduct({
      ...product,
      characteristics: [...product.characteristics, { name: "", value: "" }],
    });
  };

  const removeCharacteristic = (index: number) => {
    const newCharacteristics = [...product.characteristics];
    newCharacteristics.splice(index, 1);
    setProduct({ ...product, characteristics: newCharacteristics });
  };

  const addTechnicalDoc = () => {
    setProduct({
      ...product,
      technicalDocs: [...product.technicalDocs, { name: "", url: "" }],
    });
  };

  const removeTechnicalDoc = (index: number) => {
    const newDocs = [...product.technicalDocs];
    newDocs.splice(index, 1);
    setProduct({ ...product, technicalDocs: newDocs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await saveCatalogProduct(product);

    if (result.success) {
      toast({
        title: "Успех",
        description: "Товар сохранен",
      });

      // Обновляем локальное состояние новыми данными
      if (result.product) {
        setProduct(result.product);
      }

      // Принудительно обновляем страницу
      router.refresh();
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить товар",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад к списку
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Название"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <Input
          placeholder="Артикул"
          value={product.article}
          onChange={(e) => setProduct({ ...product, article: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Цена"
          min={0}
          max={2147483647}
          value={product.price}
          onChange={handlePriceChange}
        />
        <Select
          value={product.categoryId?.toString()}
          onValueChange={(value) => setProduct({ ...product, categoryId: parseInt(value) })}
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
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        className="min-h-[200px]"
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Характеристики</h3>
        {product.characteristics.map((char, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Название характеристики"
              value={char.name}
              onChange={(e) => {
                const newChars = [...product.characteristics];
                newChars[index].name = e.target.value;
                setProduct({ ...product, characteristics: newChars });
              }}
            />
            <Input
              placeholder="Значение"
              value={char.value}
              onChange={(e) => {
                const newChars = [...product.characteristics];
                newChars[index].value = e.target.value;
                setProduct({ ...product, characteristics: newChars });
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeCharacteristic(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addCharacteristic}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить характеристику
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Техническая документация</h3>
        {product.technicalDocs.map((doc, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Название документа"
              value={doc.name}
              onChange={(e) => {
                const newDocs = [...product.technicalDocs];
                newDocs[index].name = e.target.value;
                setProduct({ ...product, technicalDocs: newDocs });
              }}
            />
            <Input
              placeholder="URL документа"
              value={doc.url}
              onChange={(e) => {
                const newDocs = [...product.technicalDocs];
                newDocs[index].url = e.target.value;
                setProduct({ ...product, technicalDocs: newDocs });
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeTechnicalDoc(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addTechnicalDoc}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить документ
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Изображения</h3>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image}
                alt={`Product ${index + 1}`}
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
                  const newImages = [...product.images];
                  newImages.splice(index, 1);
                  setProduct({ ...product, images: newImages });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="product-images"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("product-images")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Загрузить изображения
          </Button>
        </div>
      </div>

      <Button type="submit">Сохранить изменения</Button>
    </form>
  );
}
