import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/header" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Header</h2>
          <p className="text-gray-600">Edit categories and subcategories</p>
        </Link>
        {/* Add more sections as needed */}
        <Link
          href="/admin/collections/previews"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Коллекции</h2>
          <p className="text-gray-600">Управление превью коллекций</p>
        </Link>
        <Link
          href="/admin/about"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">О нас</h2>
          <p className="text-gray-600">Управление страницей о нас</p>
        </Link>
        <Link
          href="/admin/kitchen"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Кухни</h2>
          <p className="text-gray-600">Управление страницей Кухни</p>
        </Link>
        <Link
          href="/admin/bathroom"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Ванная</h2>
          <p className="text-gray-600">Управление страницей Ванной</p>
        </Link>
        <Link
          href="/admin/main"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Главная Страница</h2>
          <p className="text-gray-600">Управление главной страницей</p>
        </Link>
      </div>
    </div>
  );
}
