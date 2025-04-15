"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface EmblaCarouselProps {
  slides: { title: string; image: string; category?: string }[];
}

const EmblaCarousel = ({ slides }: EmblaCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Cập nhật trạng thái điều hướng
  const updateNavigation = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateNavigation);
    emblaApi.on("reInit", updateNavigation);
    updateNavigation();
  }, [emblaApi, updateNavigation]);

  return (
    <div className="relative">
      {/* Wrapper cho Embla */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides?.map((slide, index) => (
            <div
              key={index}
              className="min-w-[190px]  md:min-w-[220px] lg:min-w-[250px] px-2"
            >
              <div className="overflow-hidden shadow-md relative">
                <div className="relative w-full h-[250px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center font-semibold py-2">
                <p className="text-xs font-medium">{slide?.category}</p>
            {slide.title}
          </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút điều hướng */}
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-lg rounded-full ${
          canScrollPrev ? "opacity-100" : "opacity-50 cursor-default"
        }`}
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        disabled={!canScrollPrev}
      >
        <ChevronLeft size={24} className="text-primary"/>
      </button>

      <button
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-lg rounded-full ${
          canScrollNext ? "opacity-100" : "opacity-50 cursor-default"
        }`}
        onClick={() => emblaApi && emblaApi.scrollNext()}
        disabled={!canScrollNext}
      >
        <ChevronRight size={24} className="text-primary"/>
      </button>
    </div>
  );
};

export default EmblaCarousel;
