"use client"

import { useState } from "react"
import { useSections } from "../../contexts/SectionsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BathroomSectionsAdminPage() {
  const { bathroomPage, updateBathroomPage } = useSections()
  const [sections, setSections] = useState(bathroomPage.sections)

  const handleSave = () => {
    updateBathroomPage({ ...bathroomPage, sections })
  }

  const handleSectionChange = (index: number, field: string, value: string) => {
    setSections((prev) => {
      const newSections = [...prev]
      newSections[index] = { ...newSections[index], [field]: value }
      return newSections
    })
  }

  const handleLinkChange = (index: number, field: string, value: string) => {
    setSections((prev) => {
      const newSections = [...prev]
      newSections[index] = {
        ...newSections[index],
        link: { ...newSections[index].link, [field]: value },
      }
      return newSections
    })
  }

  const handleImageChange = (sectionIndex: number, imageIndex: number, file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setSections((prev) => {
        const newSections = [...prev]
        newSections[sectionIndex].images[imageIndex] = {
          ...newSections[sectionIndex].images[imageIndex],
          src: reader.result as string,
        }
        return newSections
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование секций</h1>
      {sections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Секция {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`title-${index}`}>Заголовок</Label>
              <Input
                id={`title-${index}`}
                value={section.title}
                onChange={(e) => handleSectionChange(index, "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`description-${index}`}>Описание</Label>
              <Textarea
                id={`description-${index}`}
                value={section.description}
                onChange={(e) => handleSectionChange(index, "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`linkText-${index}`}>Текст ссылки</Label>
              <Input
                id={`linkText-${index}`}
                value={section.link.text}
                onChange={(e) => handleLinkChange(index, "text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`linkUrl-${index}`}>URL ссылки</Label>
              <Input
                id={`linkUrl-${index}`}
                value={section.link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              />
            </div>
            <div>
              <Label>Изображения</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {section.images.map((image, imageIndex) => (
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

