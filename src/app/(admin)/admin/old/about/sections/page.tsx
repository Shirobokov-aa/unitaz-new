"use client"

import { useState } from "react"
import { useSections } from "../../contexts/SectionsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutSectionsAdminPage() {
  const { aboutPage, updateAboutPage } = useSections()
  const [sections, setSections] = useState(aboutPage.sections)

  const handleSave = () => {
    updateAboutPage({ ...aboutPage, sections })
  }

  const handleSectionChange = (index: number, field: string, value: string) => {
    setSections((prev) => {
      const newSections = [...prev]
      newSections[index] = { ...newSections[index], [field]: value }
      return newSections
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование секций О компании</h1>
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
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}

