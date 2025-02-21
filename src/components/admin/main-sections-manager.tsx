/* eslint-disable @next/next/no-img-element */
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
    async (e: React.ChangeEvent<HTMLInputElement>, field: "mainImage" | "imageBlockSrcs") => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          if (field === "mainImage") {
            updateSection(field, base64String)
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
      toast({ title: "Success", description: "Main sections saved successfully" })
      router.refresh()
    } catch (error) {
      console.error("Error saving main sections:", error)
      toast({ title: "Error", description: "Failed to save main sections", variant: "destructive" })
    }
  }

  const currentSectionData = sections[currentSection]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select value={currentSection} onValueChange={(value: SectionType) => setCurrentSection(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="intro">Intro</SelectItem>
          <SelectItem value="banner">Banner</SelectItem>
          <SelectItem value="feature">Feature</SelectItem>
          <SelectItem value="collections">Collections</SelectItem>
          <SelectItem value="showcase">Showcase</SelectItem>
        </SelectContent>
      </Select>

      {currentSectionData && (
        <div className="space-y-4">
          <Input
            value={currentSectionData.title || ""}
            onChange={(e) => updateSection("title", e.target.value)}
            placeholder="Title"
          />
          <Textarea
            value={currentSectionData.description || ""}
            onChange={(e) => updateSection("description", e.target.value)}
            placeholder="Description"
          />
          <Input
            value={currentSectionData.linkName || ""}
            onChange={(e) => updateSection("linkName", e.target.value)}
            placeholder="Link Name"
          />
          <Input
            value={currentSectionData.linkUrl || ""}
            onChange={(e) => updateSection("linkUrl", e.target.value)}
            placeholder="Link URL"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Main Image</label>
            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "mainImage")} />
            {currentSectionData.mainImage && (
              <img src={currentSectionData.mainImage || "/placeholder.svg"} alt="Main" className="mt-2 max-w-xs" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image Block</label>
            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "imageBlockSrcs")} />
            {currentSectionData.imageBlockSrcs?.map((src, index) => (
              <div key={index} className="mt-4 p-4 border rounded">
                <img
                  src={src || "/placeholder.svg"}
                  alt={currentSectionData.imageBlockAlts?.[index] || ""}
                  className="max-w-xs mb-2"
                />
                <Input
                  value={currentSectionData.imageBlockAlts?.[index] || ""}
                  onChange={(e) => updateImageBlock(index, "alt", e.target.value)}
                  placeholder="Alt Text"
                  className="mb-2"
                />
                <Textarea
                  value={currentSectionData.imageBlockDescs?.[index] || ""}
                  onChange={(e) => updateImageBlock(index, "desc", e.target.value)}
                  placeholder="Description"
                  className="mb-2"
                />
                <Button type="button" onClick={() => removeImageBlock(index)} variant="destructive">
                  Remove Image
                </Button>
              </div>
            ))}
          </div>
          <Input
            type="number"
            value={currentSectionData.order}
            onChange={(e) => updateSection("order", Number.parseInt(e.target.value))}
            placeholder="Order"
          />
        </div>
      )}

      <Button type="submit">Save All Sections</Button>
    </form>
  )
}

