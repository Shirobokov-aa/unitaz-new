"use client"

import { useState } from "react"
import { useSections } from "../../contexts/SectionsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KitchenCollectionsAdminPage() {
  const { kitchenPage, updateKitchenPage } = useSections()
  const [collections, setCollections] = useState(kitchenPage.collections)

  const handleSave = () => {
    updateKitchenPage({ ...kitchenPage, collections })
  }

  const handleCollectionChange = (index: number, field: string, value: string) => {
    setCollections((prev) => {
      const newCollections = [...prev]
      newCollections[index] = { ...newCollections[index], [field]: value }
      return newCollections
    })
  }

  const handleLinkChange = (index: number, field: string, value: string) => {
    setCollections((prev) => {
      const newCollections = [...prev]
      newCollections[index] = {
        ...newCollections[index],
        link: { ...newCollections[index].link, [field]: value },
      }
      return newCollections
    })
  }

  const handleImageChange = (collectionIndex: number, imageIndex: number, file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setCollections((prev) => {
        const newCollections = [...prev]
        newCollections[collectionIndex].images[imageIndex] = {
          ...newCollections[collectionIndex].images[imageIndex],
          src: reader.result as string,
        }
        return newCollections
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование коллекций</h1>
      {collections.map((collection, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Коллекция {index + 1}</CardTitle>
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
              <Label htmlFor={`description-${index}`}>Описание</Label>
              <Textarea
                id={`description-${index}`}
                value={collection.description}
                onChange={(e) => handleCollectionChange(index, "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`linkText-${index}`}>Текст ссылки</Label>
              <Input
                id={`linkText-${index}`}
                value={collection.link.text}
                onChange={(e) => handleLinkChange(index, "text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`linkUrl-${index}`}>URL ссылки</Label>
              <Input
                id={`linkUrl-${index}`}
                value={collection.link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              />
            </div>
            <div>
              <Label>Изображения</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {collection.images.map((image, imageIndex) => (
                  <div key={imageIndex}>
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      width={100}
                      height={100}
                      className="mb-2"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageChange(index, imageIndex, file)
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}

