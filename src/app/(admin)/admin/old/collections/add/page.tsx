"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSections } from "../../contexts/SectionsContext"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CollectionItem } from "../../contexts/SectionsContext"

export default function AddCollectionAdmin() {
  const { collections, updateCollections } = useSections()
  const [newCollection, setNewCollection] = useState<Omit<CollectionItem, "id">>({
    title: "",
    desc: "",
    link: "",
    image: "",
    flexDirection: "xl:flex-row",
  })

  const handleSave = () => {
    const updatedCollections = [...collections, { ...newCollection, id: collections.length + 1 }]
    updateCollections(updatedCollections)
    console.log("Новая коллекция добавлена:", newCollection)
    // Здесь можно добавить логику для очистки формы или перенаправления пользователя
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewCollection((prev) => ({
          ...prev,
          image: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (field: keyof Omit<CollectionItem, "id">, value: string) => {
    setNewCollection((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добавление новой коллекции (превью на общей странице)</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Новая коллекция</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Заголовок</Label>
            <Input id="title" value={newCollection.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="desc">Описание</Label>
            <Textarea id="desc" value={newCollection.desc} onChange={(e) => handleChange("desc", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="link">Ссылка</Label>
            <Input id="link" value={newCollection.link} onChange={(e) => handleChange("link", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="flexDirection">Направление flex</Label>
            <Select
              onValueChange={(value) => handleChange("flexDirection", value as "xl:flex-row" | "xl:flex-row-reverse")}
              defaultValue={newCollection.flexDirection}
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
              {newCollection.image && (
                <Image
                  width={300}
                  height={300}
                  src={newCollection.image || "/placeholder.svg"}
                  alt="Предпросмотр"
                  className="w-full h-40 object-contain"
                />
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button onClick={handleSave}>Добавить коллекцию</Button>
      </div>
    </div>
  )
}

