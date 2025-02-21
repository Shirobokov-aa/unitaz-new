"use client"

import { useState } from "react"
import { useSections } from "../contexts/SectionsContext"
import { Button } from "@/components/ui/button"

export default function KitchenAdminPage() {
  const { kitchenPage, updateKitchenPage } = useSections()
  const [localKitchenPage] = useState(kitchenPage)

  const handleSave = () => {
    updateKitchenPage(localKitchenPage)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки страницы Ванная</h1>
      <p>Используйте эту страницу для управления общими настройками страницы Ванная.</p>
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}
