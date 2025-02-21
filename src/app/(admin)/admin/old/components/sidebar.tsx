"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSections } from "../contexts/SectionsContext"

export function Sidebar() {
  const pathname = usePathname()
  const { collectionDetails } = useSections()

  const sidebarItems = [
    {
      title: "Главная страница",
      items: [
        { title: "Секция 1", href: "/admin/main/section-1" },
        { title: "Секция 2", href: "/admin/main/section-2" },
        { title: "Секция 3", href: "/admin/main/section-3" },
        { title: "Секция 4", href: "/admin/main/section-4" },
        { title: "Секция 5", href: "/admin/main/section-5" },
      ],
    },
    {
      title: "Коллекции",
      items: [
        { title: "Все коллекции", href: "/admin/collections" },
        { title: "Добавить коллекцию", href: "/admin/collections/add" },
        // Только для коллекций, которые есть в collectionDetails
        ...collectionDetails.map((collection) => ({
          title: `Редактировать ${collection.name.toUpperCase()}`,
          href: `/admin/collections/edit/${collection.id}`,
        })),
      ],
    },
    {
      title: "Ванная", // Новый раздел
      items: [
        // { title: "Общие настройки", href: "/admin/bathroom" },
        { title: "Баннер", href: "/admin/bathroom/banner" },
        { title: "Секции", href: "/admin/bathroom/sections" },
        { title: "Коллекции", href: "/admin/bathroom/collections" },
      ],
    },
    {
      title: "Кухня", // Новый раздел
      items: [
        // { title: "Общие настройки", href: "/admin/bathroom" },
        { title: "Баннер", href: "/admin/kitchen/banner" },
        { title: "Секции", href: "/admin/kitchen/sections" },
        { title: "Коллекции", href: "/admin/kitchen/collections" },
      ],
    },
    {
      title: "О компании",
      items: [
        { title: "Общие настройки", href: "/admin/about" },
        { title: "Баннер", href: "/admin/about/banner" },
        { title: "Секции", href: "/admin/about/sections" },
      ],
    },
  ]

  return (
    <div className="w-64 bg-gray-100 border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4">
          <Accordion type="multiple" className="w-full">
            {sidebarItems.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  {section.items.map((item, itemIndex) => (
                    <Link href={item.href} key={itemIndex}>
                      <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

