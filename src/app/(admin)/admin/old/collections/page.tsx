"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSections } from "../contexts/SectionsContext"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Используем тот же интерфейс CollectionItem, что и в SectionsContext
import type { CollectionItem } from "../contexts/SectionsContext"

export default function CollectionsAdmin() {
  const { collections, updateCollections } = useSections()
  const [collectionsData, setCollectionsData] = useState<CollectionItem[]>(collections)

  useEffect(() => {
    setCollectionsData(collections)
  }, [collections])

  const handleSave = () => {
    updateCollections(collectionsData)
    console.log("Изменения сохранены:", collectionsData)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCollectionsData((prev) => {
          const newCollections = [...prev]
          newCollections[index] = {
            ...newCollections[index],
            image: reader.result as string,
          }
          return newCollections
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCollectionChange = (index: number, field: keyof CollectionItem, value: string) => {
    setCollectionsData((prev) => {
      const newCollections = [...prev]
      newCollections[index] = {
        ...newCollections[index],
        [field]: value,
      }
      return newCollections
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование Коллекций (превью на общей странице)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {collectionsData.map((collection, index) => (
          <Card key={collection.id} className="w-full">
            <CardHeader>
              <CardTitle>{collection.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`title-${index}`}>Заголовок</Label>
                <Input
                  id={`title-${index}`}
                  value={collection.title}
                  onChange={(e) => handleCollectionChange(index, "title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`desc-${index}`}>Описание</Label>
                <Textarea
                  id={`desc-${index}`}
                  value={collection.desc}
                  onChange={(e) => handleCollectionChange(index, "desc", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`link-${index}`}>Ссылка</Label>
                <Input
                  id={`link-${index}`}
                  value={collection.link}
                  onChange={(e) => handleCollectionChange(index, "link", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`flexDirection-${index}`}>Направление flex</Label>
                <Select
                  onValueChange={(value) =>
                    handleCollectionChange(index, "flexDirection", value as "xl:flex-row" | "xl:flex-row-reverse")
                  }
                  defaultValue={collection.flexDirection}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите направление" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xl:flex-row">Слева направо</SelectItem>
                    <SelectItem value="xl:flex-row-reverse">Справа налево</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Изображение</Label>
                <div className="space-y-2">
                  <Image
                    width={300}
                    height={300}
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-40 object-contain"
                  />
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}

