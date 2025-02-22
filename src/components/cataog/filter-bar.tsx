"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoryWithSubCategories, CatalogFilter } from "@/lib/db/schema";

interface FilterBarProps {
  filters: CatalogFilter[];
  categories: CategoryWithSubCategories[];
}

export function FilterBar({ filters, categories }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const removeCategory = () => {
    setActiveCategory(null);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-2 flex-wrap">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full">
              Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              {filters.map((filter) => (
                <div key={filter.id} className="mb-6">
                  <h3 className="font-medium mb-3">{filter.name}</h3>
                  <div className="space-y-2">
                    {filter.values.map((value) => (
                      <label key={value.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(value.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setActiveFilters([...activeFilters, value.value]);
                            } else {
                              removeFilter(value.value);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        {value.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Активные фильтры */}
        {activeCategory && (
          <Button
            variant="secondary"
            className="rounded-full flex items-center gap-2"
            onClick={removeCategory}
          >
            {activeCategory}
            <X className="h-4 w-4" />
          </Button>
        )}

        {activeFilters.map((filter) => (
          <Button
            key={filter}
            variant="secondary"
            className="rounded-full flex items-center gap-2"
            onClick={() => removeFilter(filter)}
          >
            {filter}
            <X className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Категории */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.name ? "secondary" : "ghost"}
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
