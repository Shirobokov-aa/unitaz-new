"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSections } from "@/app/admin/contexts/SectionsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import type { CollectionDetail } from "@/app/admin/contexts/SectionsContext"

type SectionKeys = "sections" | "sections2"
type ObjectKeys = keyof CollectionDetail

export default function EditCollectionPage() {
  const { id } = useParams()
  const { collectionDetails, updateCollectionDetail } = useSections()
  const [collection, setCollection] = useState<CollectionDetail | undefined>(
    collectionDetails.find((c) => c.id === Number(id)),
  )

  useEffect(() => {
    const foundCollection = collectionDetails.find((c) => c.id === Number(id))
    setCollection(foundCollection)
  }, [collectionDetails, id])

  if (!collection) {
    return <div>Collection not found</div>
  }

  const handleSave = () => {
    if (collection) {
      updateCollectionDetail(collection.id, collection)
    }
  }

  const handleChange = (section: ObjectKeys, field: string, value: string | object) => {
    setCollection((prev) => {
      if (!prev) return prev
      if (section === "banner") {
        return {
          ...prev,
          banner: {
            ...prev.banner,
            [field]: value,
          },
        }
      }
      if (typeof prev[section] === "object" && prev[section] !== null) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }
      }
      return prev
    })
  }

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    section: keyof CollectionDetail,
    index: number,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCollection((prev) => {
          if (!prev) return prev
          if (section === "banner") {
            return {
              ...prev,
              banner: {
                ...prev.banner,
                image: reader.result as string,
              },
            }
          } else if (section in prev && Array.isArray(prev[section])) {
            const newSection = [...prev[section as SectionKeys]]
            if (newSection[index] && "images" in newSection[index]) {
              newSection[index] = {
                ...newSection[index],
                images: [...(newSection[index].images || []), { src: reader.result as string, alt: "" }],
              }
            }
            return {
              ...prev,
              [section]: newSection,
            }
          }
          return prev
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Collection: {collection.name}</h1>

      {/* Banner Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Banner</h2>
        <Input
          value={collection.banner.title}
          onChange={(e) => handleChange("banner", "title", e.target.value)}
          placeholder="Banner Title"
        />
        <Textarea
          value={collection.banner.description}
          onChange={(e) => handleChange("banner", "description", e.target.value)}
          placeholder="Banner Description"
        />
        <Input
          value={collection.banner.link.text}
          onChange={(e) => handleChange("banner", "link", { ...collection.banner.link, text: e.target.value })}
          placeholder="Banner Link Text"
        />
        <Input
          value={collection.banner.link.url}
          onChange={(e) => handleChange("banner", "link", { ...collection.banner.link, url: e.target.value })}
          placeholder="Banner Link URL"
        />
        <div>
          <Label>Banner Image</Label>
          <Image src={collection.banner.image || "/placeholder.svg"} alt="Banner" width={200} height={100} />
          <Input type="file" onChange={(e) => handleImageUpload(e, "banner", 0)} accept="image/*" />
        </div>
      </div>

      {/* Sections */}
      {(["sections", "sections2", "sections3", "sections4"] as const).map((sectionType) => (
        <div key={sectionType} className="space-y-4">
          <h2 className="text-2xl font-semibold">{sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}</h2>
          {collection[sectionType].map((section, index) => (
            <div key={index} className="border p-4 rounded">
              <Input
                value={section.title}
                onChange={(e) => {
                  const newSections = [...collection[sectionType]]
                  newSections[index] = { ...newSections[index], title: e.target.value }
                  setCollection({ ...collection, [sectionType]: newSections })
                }}
                placeholder="Section Title"
              />
              <Textarea
                value={section.description}
                onChange={(e) => {
                  const newSections = [...collection[sectionType]]
                  newSections[index] = { ...newSections[index], description: e.target.value }
                  setCollection({ ...collection, [sectionType]: newSections })
                }}
                placeholder="Section Description"
              />
              {"link" in section && section.link && (
                <>
                  <Input
                    value={section.link.text}
                    onChange={(e) => {
                      const newSections = [...collection[sectionType]]
                      newSections[index] = { ...newSections[index], link: { ...section.link, text: e.target.value } }
                      setCollection({ ...collection, [sectionType]: newSections })
                    }}
                    placeholder="Link Text"
                  />
                  <Input
                    value={section.link.url}
                    onChange={(e) => {
                      const newSections = [...collection[sectionType]]
                      newSections[index] = { ...newSections[index], link: { ...section.link, url: e.target.value } }
                      setCollection({ ...collection, [sectionType]: newSections })
                    }}
                    placeholder="Link URL"
                  />
                </>
              )}
              {section.images &&
                section.images.map((image, imageIndex) => (
                  <div key={imageIndex}>
                    <Label>Image {imageIndex + 1}</Label>
                    <Image src={image.src || "/placeholder.svg"} alt={image.alt} width={100} height={100} />
                    <Input type="file" onChange={(e) => handleImageUpload(e, sectionType, index)} accept="image/*" />
                    <Input
                      value={image.alt}
                      onChange={(e) => {
                        const newSections = [...collection[sectionType]]
                        newSections[index].images[imageIndex] = { ...image, alt: e.target.value }
                        setCollection({ ...collection, [sectionType]: newSections })
                      }}
                      placeholder="Image Alt Text"
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      ))}

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}

