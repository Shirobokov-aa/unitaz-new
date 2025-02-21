// import { CollectionDetailManager } from "@/components/admin/collection-managers/collection-detail-manager";
// import { fetchCollectionById } from "@/actions/query";
// import { notFound } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// interface PageProps {
//   params: { id: string }
// }

// // Отключаем кеширование
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// // Функция для получения данных коллекции
// async function getCollectionData(id: string) {
//   if (!id || !/^\d+$/.test(id)) {
//     return null;
//   }
//   return await fetchCollectionById(parseInt(id, 10));
// }

// export default async function CollectionDetailPage(props: PageProps) {
//   const { params } = props;

//   try {
//     const collection = await getCollectionData(params.id);

//     if (!collection) {
//       return notFound();
//     }

//     return (
//       <div className="container mx-auto py-10">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-xl font-semibold">Редактирование коллекции</h1>
//           <Button asChild variant="outline">
//             <Link href="/admin/collections/previews">Назад к списку</Link>
//           </Button>
//         </div>
//         <CollectionDetailManager initialData={collection} />
//       </div>
//     );
//   } catch (error) {
//     console.error('Error in CollectionDetailPage:', error);
//     return notFound();
//   }
// }
