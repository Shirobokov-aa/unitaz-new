import Image from "next/image"
import Link from "next/link"
import { CatalogProduct } from "@/lib/db/schema"

interface ProductGridProps {
  products: CatalogProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/catalog/${product.id}`} className="group">
          <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-sm mb-4">{product.name}</h3>
          <div className="flex gap-2">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border border-gray-200"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>
          <div className="mt-2 text-lg font-medium">
            {product.price.toLocaleString('ru-RU')} руб.
          </div>
        </Link>
      ))}
    </div>
  )
}
