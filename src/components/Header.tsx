"use client";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import HoverMenu from "./HoverMenu";
import { CategoryWithSubCategories } from "@/lib/db/schema";

interface HeaderProps {
  categories: CategoryWithSubCategories[];
  defaultTextColor?: string;
  activeTextColor?: string;
}

export default function Header({ categories, defaultTextColor = "text-white", activeTextColor = "text-black" }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMenuLocked, setIsMenuLocked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY === 0);
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMouseEnter = (categoryName: string) => {
    if (!isMenuLocked) {
      setActiveCategory(categoryName);
    }
  };

  const handleMouseLeave = () => {
    if (!isMenuLocked) {
      setActiveCategory(null);
    }
  };

  const handleClick = (categoryName: string) => {
    if (activeCategory === categoryName && isMenuLocked) {
      setIsMenuLocked(false);
      setActiveCategory(null);
    } else {
      setIsMenuLocked(true);
      setActiveCategory(categoryName);
    }
  };

  const closeMenu = () => {
    setIsMenuLocked(false);
    setActiveCategory(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isHeaderWhite = !isAtTop || activeCategory !== null || isMobileMenuOpen;
  const currentTextColor = isHeaderWhite ? activeTextColor : defaultTextColor;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isHeaderWhite ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-1440 mx-auto lg:px-24 px-5">
        <nav className="flex items-center justify-between h-20 text-header">
          <Link href="/" className={`lg:block hidden text-2xl font-bold ${currentTextColor}`}>
            <Image src="/img/logo.svg" alt="Logo" width={263} height={35} className="object-contain" />
          </Link>
          <Link href="/" className={`block lg:hidden text-2xl font-bold ${currentTextColor}`}>
            <Image src="/img/logo.svg" alt="Logo" width={168} height={22} className="object-contain" />
          </Link>
          <ul className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <li
                key={category.name}
                className={`hover:opacity-80 transition-colors relative ${currentTextColor}`}
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={""} onClick={() => handleClick(category.name)} className="py-2 block">
                  {category.name}
                </Link>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-300 ${
                    activeCategory === category.name ? "scale-x-100" : ""
                  }`}
                />
              </li>
            ))}
            <li className={`hover:opacity-80 transition-colors ${currentTextColor}`}>
              <Link href={"/collections"}>Коллекции</Link>
            </li>
            <li className={`hover:opacity-80 transition-colors ${currentTextColor}`}>
              <Link href={"/about"}>О компании</Link>
            </li>
            <li className={`hover:opacity-80 transition-colors ${currentTextColor}`}>
              <Link href={"/"}>Контакты</Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-full transition-colors ${
                isHeaderWhite ? "hover:bg-black/10" : "hover:bg-white/10"
              }`}
            >
              <Search className={`w-5 h-5 ${currentTextColor}`} />
            </button>
            <button
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isHeaderWhite ? "hover:bg-black/10" : "hover:bg-white/10"
              }`}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${currentTextColor}`} />
              ) : (
                <Menu className={`w-6 h-6 ${currentTextColor}`} />
              )}
            </button>
          </div>
        </nav>
      </div>
      {categories.map((category) => (
        <HoverMenu
          key={category.name}
          category={category}
          isVisible={activeCategory === category.name}
          onClose={closeMenu}
        />
      ))}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <ul className="py-4">
            {categories.map((category) => (
              <li key={category.name} className="px-5 py-2">
                <Link href={"/"} className={`block ${activeTextColor} hover:opacity-80 transition-colors`}>
                  {category.name}
                </Link>
              </li>
            ))}
            <li className="px-5 py-2">
              <Link href={"/"} className={`block ${activeTextColor} hover:opacity-80 transition-colors`}>
                Сервисы
              </Link>
            </li>
            <li className="px-5 py-2">
              <Link href={"/"} className={`block ${activeTextColor} hover:opacity-80 transition-colors`}>
                О компании
              </Link>
            </li>
            <li className="px-5 py-2">
              <Link href={"/"} className={`block ${activeTextColor} hover:opacity-80 transition-colors`}>
                Контакты
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
