"use client"

import { useState } from "react"
import type { ImageSlide } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { saveImageSlides } from "@/actions/inserts"

interface ImageSlideManagerProps {
  initialSlides: ImageSlide[]
}

export function ImageSlideManager({ initialSlides }: ImageSlideManagerProps) {
  const [slides, setSlides] = useState<ImageSlide[]>(initialSlides)
  const [editingSlide, setEditingSlide] = useState<ImageSlide | null>(null)
  const router = useRouter()

  const addSlide = () => {
    setEditingSlide({ id: 0, desktopImage: "", mobileImage: "", title: "" })
  }

  const updateSlide = (field: keyof ImageSlide, value: string) => {
    if (editingSlide) {
      setEditingSlide({ ...editingSlide, [field]: value })
    }
  }

  const saveSlide = async () => {
    if (editingSlide) {
      const updatedSlides = editingSlide.id
        ? slides.map((slide) => (slide.id === editingSlide.id ? editingSlide : slide))
        : [...slides, { ...editingSlide, id: Date.now() }]

      try {
        await saveImageSlides(updatedSlides)
        setSlides(updatedSlides)
        setEditingSlide(null)
        toast({ title: "Success", description: "Image slide saved successfully" })
        router.refresh()
      } catch (error) {
        console.error("Error saving image slide:", error)
        toast({ title: "Error", description: "Failed to save image slide", variant: "destructive" })
      }
    }
  }

  const deleteSlide = async (id: number) => {
    try {
      const updatedSlides = slides.filter((slide) => slide.id !== id)
      await saveImageSlides(updatedSlides)
      setSlides(updatedSlides)
      toast({ title: "Success", description: "Image slide deleted successfully" })
      router.refresh()
    } catch (error) {
      console.error("Error deleting image slide:", error)
      toast({ title: "Error", description: "Failed to delete image slide", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={addSlide}>
        <Plus className="mr-2 h-4 w-4" /> Add New Slide
      </Button>

      {editingSlide && (
        <div className="border p-4 rounded-lg space-y-4">
          <Input
            value={editingSlide.title}
            onChange={(e) => updateSlide("title", e.target.value)}
            placeholder="Slide Title"
          />
          <Input
            value={editingSlide.desktopImage}
            onChange={(e) => updateSlide("desktopImage", e.target.value)}
            placeholder="Desktop Image URL"
          />
          <Input
            value={editingSlide.mobileImage}
            onChange={(e) => updateSlide("mobileImage", e.target.value)}
            placeholder="Mobile Image URL"
          />
          <Button onClick={saveSlide}>Save Slide</Button>
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-center justify-between border p-4 rounded-lg">
            <div>
              <h3 className="font-bold">{slide.title}</h3>
              <p className="text-sm text-gray-500">Desktop: {slide.desktopImage}</p>
              <p className="text-sm text-gray-500">Mobile: {slide.mobileImage}</p>
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={() => setEditingSlide(slide)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteSlide(slide.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

