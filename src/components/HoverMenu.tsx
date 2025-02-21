// import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import ImageBlock from "./blocks/image-block";
import { CategoryWithSubCategories } from "@/lib/db/schema";

interface HoverMenuProps {
  category: CategoryWithSubCategories;
  isVisible: boolean;
  onClose: () => void;
}

export default function HoverMenu({ category, isVisible, onClose }: HoverMenuProps) {
  if (!isVisible) return null;

  const images = category.images.map((src) => ({
    src,
    alt: "Image description",
  }));

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg animate-fadeIn">
      <div className="max-w-1440 mx-auto lg:px-24 px-5 py-8 flex relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="w-1/2">
          <h3 className="text-xl font-bold mb-4">{category.name}</h3>
          <ul className="space-y-2">
            {category.subCategories.map((subcat, index) => (
              <li key={index}>
                <Link href={subcat.href} className="hover:underline">
                  {subcat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-[800px] w-full">
          <ImageBlock images={images} />
        </div>
      </div>
    </div>
  );
}
