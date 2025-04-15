import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Country } from "@prisma/client";
import Link from "next/link";

interface TestCarouselProps {
  countries?: Country[];
  categoryCountries?: Country[];
  isLoading?: boolean;
}

const TestCarousel = ({ countries, categoryCountries, isLoading }: TestCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
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
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-[250px]">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex">
            {countries?.map((coun) => (
              <Link key={coun.id} href={`/country/${coun.id}`}>
                <div className="min-w-[190px]  md:min-w-[220px] lg:min-w-[250px] px-2 group">
                  <div className="overflow-hidden shadow-md relative">
                    <div className="relative w-full h-[250px]">
                      <Image
                        src={coun.imageUrl}
                        alt={coun.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center font-semibold py-2">
                      {coun.name}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {categoryCountries?.map((coun) => (
              <Link key={coun.id} href={`/country/${coun.id}`}>
                <div className="min-w-[190px]  md:min-w-[220px] lg:min-w-[250px] px-2 group">
                  <div className="overflow-hidden shadow-md relative">
                    <div className="relative w-full h-[250px]">
                      <Image
                        src={coun.imageUrl}
                        alt={coun.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center font-semibold py-2">
                      {coun.name}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Nút điều hướng */}
      {(countries && countries.length > 3 || categoryCountries && categoryCountries?.length > 3) && (
        <>
        <button
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-lg rounded-full ${
          canScrollPrev ? "opacity-100" : "opacity-50 cursor-default"
        }`}
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        disabled={!canScrollPrev}
      >
        <ChevronLeft size={24} className="text-primary" />
      </button>

      <button
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-lg rounded-full ${
          canScrollNext ? "opacity-100" : "opacity-50 cursor-default"
        }`}
        onClick={() => emblaApi && emblaApi.scrollNext()}
        disabled={!canScrollNext}
      >
        <ChevronRight size={24} className="text-primary" />
      </button>
        </>
      )}
      
    </div>
  );
};

export default TestCarousel;
