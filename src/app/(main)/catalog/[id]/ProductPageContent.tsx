import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CatalogProduct } from "@/lib/db/schema"
// export const dynamic = 'force-dynamic';

interface ProductPageContentProps {
  product: CatalogProduct & {
    category: { id: number; name: string } | null;
    subCategory: { id: number; name: string } | null;
    colors: Array<{ name: string; code: string }>;
    characteristics: Array<{ name: string; value: string }>;
    technicalDocs: Array<{ name: string; url: string }>;
  }
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="text-sm text-gray-500 mb-8">
        <Link href="/">Главная</Link> / <Link href="/catalog">Каталог</Link> / {product.name}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <Image
              src="/placeholder.svg"
              alt="Product image"
              width={600}
              height={600}
              className="w-full aspect-square object-cover"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl mb-4">{product.name}</h1>
          <div className="text-gray-500 mb-8">Артикул {product.article}</div>
          <div className="text-2xl mb-8">{product.price} руб.</div>

          {product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm mb-4">Цвет: {product.colors[0].name}</h3>
              <div className="flex gap-4">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.code }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <p className="text-gray-600 mb-8">{product.description}</p>
          )}

          <Tabs defaultValue="characteristics">
            <TabsList className="w-full justify-start border-b mb-4">
              <TabsTrigger value="characteristics" className="text-lg">
                Характеристики
              </TabsTrigger>
              <TabsTrigger value="documentation" className="text-lg">
                Техническая документация
              </TabsTrigger>
            </TabsList>
            <TabsContent value="characteristics">
              <div className="space-y-2">
                {product.characteristics.map((char, index) => (
                  <div key={index} className="grid grid-cols-2">
                    <div className="font-medium">{char.name}</div>
                    <div>{char.value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="documentation">
              <div className="space-y-2">
                {product.technicalDocs.map((doc, index) => (
                  <div key={index}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {doc.name}
                    </a>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

