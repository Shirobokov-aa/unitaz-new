"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageSlide } from "@/lib/db/schema";

const SLIDE_DURATION = 4000; // 5 seconds

export function BannerSlider({ slides }: { slides: ImageSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  useEffect(() => {
    const updateMedia = () => setIsMobile(window.innerWidth < 768);
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  // Touch & Mouse Drag Events
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    endX.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startX.current) return;
    endX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = () => {
    if (!startX.current || !endX.current) return;
    const distance = startX.current - endX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setIsDragging(false);
  };

  // Добавим отладочный вывод для проверки данных
  useEffect(() => {
    console.log('Slides data:', slides);
  }, [slides]);

  console.log('Rendering BannerSlider with slides:', slides);

  const formatUrl = (url: string) => {
    if (!url) return '/';
    // Если URL не начинается с '/' или 'http', добавляем '/'
    if (!url.startsWith('/') && !url.startsWith('http')) {
      return `/${url}`;
    }
    return url;
  };

  return (
    <div
      className="relative lg:h-[915px] h-[542px] w-full overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={isDragging ? handleTouchMove : undefined}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        console.log(`Slide ${index}:`, {
          id: slide.id,
          title: slide.title,
          titleUrl: slide.titleUrl,
          formattedUrl: formatUrl(slide.titleUrl)
        });

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={isMobile ? slide.mobileImage : slide.desktopImage}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/20">
              <Link
                href={formatUrl(slide.titleUrl)}
                className="absolute top-72 right-0 lg:py-9 py-7 lg:px-[150px] px-24 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] transition-colors"
              >
                <h2 className="lg:text-xl font-light border-b border-b-white">
                  {slide.title}
                </h2>
              </Link>
            </div>
          </div>
        );
      })}

      {/* Индикаторы */}
      <div className="absolute bottom-8 left-8 right-8 flex gap-2 z-10">
        {slides.map((_, index) => (
          <div key={index} className="h-[2px] flex-1 bg-white/30 relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-white transition-all duration-[${SLIDE_DURATION}ms] ${
                index === currentSlide ? "w-full" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
