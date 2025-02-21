"use client"

import { useState } from "react"
import { useSections } from "../contexts/SectionsContext"
import { Button } from "@/components/ui/button"

export default function BathroomAdminPage() {
  const { bathroomPage, updateBathroomPage } = useSections()
  const [localBathroomPage] = useState(bathroomPage)

  const handleSave = () => {
    updateBathroomPage(localBathroomPage)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки страницы Ванная</h1>
      <p>Используйте эту страницу для управления общими настройками страницы Ванная.</p>
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}
