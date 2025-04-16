"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ArticleWithUser } from "@/types";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface PostCarouselProps {
  slides: ArticleWithUser[];
  isLoading?: boolean;
}

const PostCarousel = ({ slides, isLoading }: PostCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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

  const renderLoadingSkeleton = () => (
    <div className="flex gap-4 px-2">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="min-w-[200px] md:min-w-[280px] lg:min-w-[350px]">
          <div className="overflow-hidden shadow-md rounded-lg bg-white">
            <Skeleton className="w-full h-[250px] rounded-t-lg shimmer" />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2 shimmer" />
              <Skeleton className="h-4 w-1/2 shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      {/* Embla Carousel wrapper */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex p-2">
          {isLoading ? (
            renderLoadingSkeleton()
          ) : slides.length === 0 ? (
            <div className="flex items-center justify-center w-full py-10 font-semibold text-center">
              Chưa có bài viết
            </div>
          ) : (
            slides.map((slide) => (
              <Link key={slide.id} href={`/post/${slide.slug}`} className="min-w-[200px] md:min-w-[280px] lg:min-w-[350px] px-2 group">
                <div className="overflow-hidden shadow-md h-full flex flex-col bg-white rounded-lg">
                  <div className="relative w-full h-[250px]">
                    <Image
                      src={slide.imageUrl || ""}
                      alt={slide.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow justify-between">
                    <h1 className="font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {slide.title}
                    </h1>
                    <p className="text-xs text-gray-500">👤 {slide.user.name}</p>
                    <p className="text-xs text-gray-500">🕒 {slide.readingTime} phút đọc</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      {slides.length >= 2 && (
        <>
          <button
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-lg rounded-full transition-opacity ${
              canScrollPrev ? "opacity-100" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>

          <button
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-lg rounded-full transition-opacity ${
              canScrollNext ? "opacity-100" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
          >
            <ChevronRight size={24} className="text-primary" />
          </button>
        </>
      )}
    </div>
  );
};

export default PostCarousel;
