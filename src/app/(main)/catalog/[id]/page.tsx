import { Suspense } from "react"
import { notFound } from "next/navigation"
import { fetchProductById } from "@/actions/query"
import ProductPageContent from "./ProductPageContent"


export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  const product = await fetchProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageContent product={product} />
    </Suspense>
  )
}
