"use client"

import { useState } from "react"
import type { ImageSlide } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { saveImageSlides } from "@/actions/inserts"
import Image from "next/image"

interface ImageSlideManagerProps {
  initialSlides: ImageSlide[]
}

export function ImageSlideManager({ initialSlides }: ImageSlideManagerProps) {
  const [slides, setSlides] = useState<ImageSlide[]>(initialSlides)
  const [editingSlide, setEditingSlide] = useState<ImageSlide | null>(null)
  const router = useRouter()

  const addSlide = () => {
    setEditingSlide({
      id: 0,
      desktopImage: "",
      mobileImage: "",
      title: "",
      titleUrl: ""
    })
  }

  const handleImageUpload = async (type: 'desktopImage' | 'mobileImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingSlide) return

    try {
      const reader = new FileReader()
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setEditingSlide({ ...editingSlide, [type]: imageDataUrl })
      toast({
        title: "Успех",
        description: "Изображение загружено",
      })
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      })
    }
  }

  const updateSlide = (field: keyof ImageSlide, value: string) => {
    if (editingSlide) {
      console.log('Updating slide field:', field, 'with value:', value);
      setEditingSlide({ ...editingSlide, [field]: value })
    }
  }

  const saveSlide = async () => {
    if (editingSlide) {
      console.log('Saving slide with data:', editingSlide);
      const updatedSlides = editingSlide.id
        ? slides.map((slide) => (slide.id === editingSlide.id ? editingSlide : slide))
        : [...slides, { ...editingSlide, id: Date.now() }]

      try {
        await saveImageSlides(updatedSlides)
        setSlides(updatedSlides)
        setEditingSlide(null)
        toast({ title: "Успех", description: "Слайд сохранен" })
        router.refresh()
      } catch (error) {
        console.error("Error saving image slide:", error)
        toast({ title: "Ошибка", description: "Не удалось сохранить слайд", variant: "destructive" })
      }
    }
  }

  const deleteSlide = async (id: number) => {
    try {
      const updatedSlides = slides.filter((slide) => slide.id !== id)
      await saveImageSlides(updatedSlides)
      setSlides(updatedSlides)
      toast({ title: "Успех", description: "Слайд удален" })
      router.refresh()
    } catch (error) {
      console.error("Error deleting image slide:", error)
      toast({ title: "Ошибка", description: "Не удалось удалить слайд", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={addSlide}>
        <Plus className="mr-2 h-4 w-4" /> Добавить новый слайд
      </Button>

      {editingSlide && (
        <div className="border p-4 rounded-lg space-y-4">
          <Input
            value={editingSlide.title}
            onChange={(e) => updateSlide("title", e.target.value)}
            placeholder="Название слайда"
          />

          <Input
            value={editingSlide.titleUrl}
            onChange={(e) => updateSlide("titleUrl", e.target.value)}
            placeholder="URL для перехода"
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Изображение для десктопа</label>
              {editingSlide.desktopImage && (
                <div className="mb-2">
                  <Image
                    src={editingSlide.desktopImage}
                    alt="Desktop preview"
                    width={400}
                    height={200}
                    className="rounded object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('desktopImage', e)}
                className="hidden"
                id="desktop-image"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('desktop-image')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Загрузить изображение
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Изображение для мобильных</label>
              {editingSlide.mobileImage && (
                <div className="mb-2">
                  <Image
                    src={editingSlide.mobileImage}
                    alt="Mobile preview"
                    width={200}
                    height={300}
                    className="rounded object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('mobileImage', e)}
                className="hidden"
                id="mobile-image"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('mobile-image')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Загрузить изображение
              </Button>
            </div>
          </div>

          <Button onClick={saveSlide}>Сохранить слайд</Button>
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-center justify-between border p-4 rounded-lg">
            <div className="space-y-2">
              <h3 className="font-bold">{slide.title}</h3>
              <p className="text-sm text-gray-500">URL: {slide.titleUrl}</p>
              <div className="grid grid-cols-2 gap-4">
                {slide.desktopImage && (
                  <Image
                    src={slide.desktopImage}
                    alt="Desktop version"
                    width={200}
                    height={100}
                    className="rounded object-cover"
                  />
                )}
                {slide.mobileImage && (
                  <Image
                    src={slide.mobileImage}
                    alt="Mobile version"
                    width={100}
                    height={150}
                    className="rounded object-cover"
                  />
                )}
              </div>
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

