"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { MainSection } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { saveMainSections } from "@/actions/inserts"
import { Label } from "@/components/ui/label"
import Image from "next/image"

type SectionType = "intro" | "banner" | "feature" | "collections" | "showcase"

interface MainSectionsManagerProps {
  initialSections: Record<SectionType, MainSection | null>
}

export function MainSectionsManager({ initialSections }: MainSectionsManagerProps) {
  const [sections, setSections] = useState<Record<SectionType, MainSection | null>>(initialSections)
  const [currentSection, setCurrentSection] = useState<SectionType>("intro")
  const router = useRouter()

  const updateSection = useCallback(
    (field: keyof MainSection, value: unknown) => {
      setSections((prev) => ({
        ...prev,
        [currentSection]: {
          ...prev[currentSection]!,
          [field]: value,
        },
      }))
    },
    [currentSection],
  )

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, field: "mainImage" | "imageBlockSrcs", index?: number) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          if (field === "mainImage") {
            updateSection(field, base64String)
          } else if (index !== undefined) {
            const newImageBlockSrcs = [...(sections[currentSection]?.imageBlockSrcs || [])]
            newImageBlockSrcs[index] = base64String
            updateSection("imageBlockSrcs", newImageBlockSrcs)
          } else {
            updateSection("imageBlockSrcs", [...(sections[currentSection]?.imageBlockSrcs || []), base64String])
            updateSection("imageBlockAlts", [...(sections[currentSection]?.imageBlockAlts || []), ""])
            updateSection("imageBlockDescs", [...(sections[currentSection]?.imageBlockDescs || []), ""])
          }
        }
        reader.readAsDataURL(file)
      }
    },
    [currentSection, sections, updateSection],
  )

  const updateImageBlock = (index: number, field: "alt" | "desc", value: string) => {
    const currentSectionData = sections[currentSection]
    if (currentSectionData) {
      const updatedField = field === "alt" ? "imageBlockAlts" : "imageBlockDescs"
      const updatedValues = [...(currentSectionData[updatedField] || [])]
      updatedValues[index] = value
      updateSection(updatedField, updatedValues)
    }
  }

  const removeImageBlock = (index: number) => {
    const currentSectionData = sections[currentSection]
    if (currentSectionData) {
      updateSection(
        "imageBlockSrcs",
        (currentSectionData.imageBlockSrcs || []).filter((_, i) => i !== index),
      )
      updateSection(
        "imageBlockAlts",
        (currentSectionData.imageBlockAlts || []).filter((_, i) => i !== index),
      )
      updateSection(
        "imageBlockDescs",
        (currentSectionData.imageBlockDescs || []).filter((_, i) => i !== index),
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await saveMainSections(Object.values(sections).filter((section): section is MainSection => section !== null))
      toast({ title: "Успех", description: "Секции сохранены успешно" })
      router.refresh()
    } catch (error) {
      console.error("Error saving main sections:", error)
      toast({ title: "Ошибка", description: "Не удалось сохранить секции", variant: "destructive" })
    }
  }

  const currentSectionData = sections[currentSection]

  const createNewSection = (type: SectionType) => {
    setSections(prev => ({
      ...prev,
      [type]: {
        id: 0,
        section: type,
        title: "",
        description: "",
        linkName: "",
        linkUrl: "",
        mainImage: null,
        imageBlockSrcs: [],
        imageBlockAlts: [],
        imageBlockDescs: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))
    setCurrentSection(type)
  }

  const renderSectionFields = () => {
    if (!currentSectionData) return null

    switch (currentSection) {
      case "intro":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={currentSectionData.title || ""}
                  onChange={(e) => updateSection("title", e.target.value)}
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={currentSectionData.description || ""}
                  onChange={(e) => updateSection("description", e.target.value)}
                />
              </div>
              <div>
                <Label>Текст ссылки</Label>
                <Input
                  value={currentSectionData.linkName || ""}
                  onChange={(e) => updateSection("linkName", e.target.value)}
                />
              </div>
              <div>
                <Label>URL ссылки</Label>
                <Input
                  value={currentSectionData.linkUrl || ""}
                  onChange={(e) => updateSection("linkUrl", e.target.value)}
                />
              </div>
              <div>
                <Label>Главное изображение</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "mainImage")} />
                {currentSectionData.mainImage && (
                  <Image
                    src={currentSectionData.mainImage}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
              <div>
                <Label>Блок изображений</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "imageBlockSrcs")} />
                {currentSectionData.imageBlockSrcs?.map((src, index) => (
                  <div key={index} className="mt-4 p-4 border rounded">
                    <Image
                      src={src}
                      alt={currentSectionData.imageBlockAlts?.[index] || ""}
                      width={300}
                      height={300}
                      className="max-w-xs mb-2"
                    />
                    <Button type="button" onClick={() => removeImageBlock(index)} variant="destructive">
                      Удалить изображение
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "banner":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Текст ссылки</Label>
                <Input
                  value={currentSectionData.linkName || ""}
                  onChange={(e) => updateSection("linkName", e.target.value)}
                />
              </div>
              <div>
                <Label>URL ссылки</Label>
                <Input
                  value={currentSectionData.linkUrl || ""}
                  onChange={(e) => updateSection("linkUrl", e.target.value)}
                />
              </div>
              <div>
                <Label>Главное изображение</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "mainImage")} />
                {currentSectionData.mainImage && (
                  <Image
                    src={currentSectionData.mainImage}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
            </div>
          </>
        )

      case "feature":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={currentSectionData.title || ""}
                  onChange={(e) => updateSection("title", e.target.value)}
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={currentSectionData.description || ""}
                  onChange={(e) => updateSection("description", e.target.value)}
                />
              </div>
              <div>
                <Label>Текст ссылки</Label>
                <Input
                  value={currentSectionData.linkName || ""}
                  onChange={(e) => updateSection("linkName", e.target.value)}
                />
              </div>
              <div>
                <Label>URL ссылки</Label>
                <Input
                  value={currentSectionData.linkUrl || ""}
                  onChange={(e) => updateSection("linkUrl", e.target.value)}
                />
              </div>
              <div>
                <Label>Главное изображение</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "mainImage")} />
                {currentSectionData.mainImage && (
                  <Image
                    src={currentSectionData.mainImage}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
            </div>
          </>
        )

      case "collections":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={currentSectionData.title || ""}
                  onChange={(e) => updateSection("title", e.target.value)}
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={currentSectionData.description || ""}
                  onChange={(e) => updateSection("description", e.target.value)}
                />
              </div>
              <div>
                <Label>Текст ссылки</Label>
                <Input
                  value={currentSectionData.linkName || ""}
                  onChange={(e) => updateSection("linkName", e.target.value)}
                />
              </div>
              <div>
                <Label>URL ссылки</Label>
                <Input
                  value={currentSectionData.linkUrl || ""}
                  onChange={(e) => updateSection("linkUrl", e.target.value)}
                />
              </div>
              <div>
                <Label>Блок изображений</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "imageBlockSrcs")} />
                {currentSectionData.imageBlockSrcs?.map((src, index) => (
                  <div key={index} className="mt-4 p-4 border rounded">
                    <Image
                      src={src}
                      alt={currentSectionData.imageBlockAlts?.[index] || ""}
                      width={300}
                      height={300}
                      className="max-w-xs mb-2"
                    />
                    <Input
                      value={currentSectionData.imageBlockAlts?.[index] || ""}
                      onChange={(e) => updateImageBlock(index, "alt", e.target.value)}
                      placeholder="Alt текст"
                      className="mb-2"
                    />
                    <Input
                      value={currentSectionData.imageBlockDescs?.[index] || ""}
                      onChange={(e) => updateImageBlock(index, "desc", e.target.value)}
                      placeholder="Описание"
                      className="mb-2"
                    />
                    <Button type="button" onClick={() => removeImageBlock(index)} variant="destructive">
                      Удалить изображение
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "showcase":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={currentSectionData.title || ""}
                  onChange={(e) => updateSection("title", e.target.value)}
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={currentSectionData.description || ""}
                  onChange={(e) => updateSection("description", e.target.value)}
                />
              </div>
              <div>
                <Label>Текст ссылки</Label>
                <Input
                  value={currentSectionData.linkName || ""}
                  onChange={(e) => updateSection("linkName", e.target.value)}
                />
              </div>
              <div>
                <Label>URL ссылки</Label>
                <Input
                  value={currentSectionData.linkUrl || ""}
                  onChange={(e) => updateSection("linkUrl", e.target.value)}
                />
              </div>
              <div>
                <Label>Блок изображений</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "imageBlockSrcs")} />
                {currentSectionData.imageBlockSrcs?.map((src, index) => (
                  <div key={index} className="mt-4 p-4 border rounded">
                    <Image
                      src={src}
                      alt={currentSectionData.imageBlockAlts?.[index] || ""}
                      width={300}
                      height={300}
                      className="max-w-xs mb-2"
                    />
                    <Button type="button" onClick={() => removeImageBlock(index)} variant="destructive">
                      Удалить изображение
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={currentSection} onValueChange={(value: SectionType) => setCurrentSection(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите секцию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intro">Интро</SelectItem>
            <SelectItem value="banner">Баннер</SelectItem>
            <SelectItem value="feature">Особенности</SelectItem>
            <SelectItem value="collections">Коллекции</SelectItem>
            <SelectItem value="showcase">Витрина</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Сохранить все секции</Button>
      </div>

      {!sections[currentSection] && (
        <div className="p-4 border rounded">
          <p className="mb-4">Секция &quot;{currentSection}&quot; не создана</p>
          <Button
            type="button"
            onClick={() => createNewSection(currentSection)}
          >
            Создать секцию {currentSection}
          </Button>
        </div>
      )}

      {renderSectionFields()}
    </form>
  )
}
