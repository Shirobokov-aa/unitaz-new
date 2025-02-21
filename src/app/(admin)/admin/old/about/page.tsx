"use client"

import { useState } from "react"
import { useSections } from "../contexts/SectionsContext"
import { Button } from "@/components/ui/button"

export default function AboutAdminPage() {
  const { aboutPage, updateAboutPage } = useSections()
  const [localAboutPage] = useState(aboutPage)

  const handleSave = () => {
    updateAboutPage(localAboutPage)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки страницы О компании</h1>
      <p>Используйте эту страницу для управления общими настройками страницы О компании.</p>
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}

