import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTours, getToursById } from "../app/actions/tour";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../components/ui/skeleton";
import { TourWithDestination } from "../types";

interface TourCarouselProps {
  id?: string;
  destinationId?: string;
  exclude?: string;
}

const TourCarousel = ({ id, destinationId, exclude }: TourCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toursData, setToursData] = useState<TourWithDestination[]>([]);

  useEffect(() => {
    const fetchTours = async (id?: string, exclude?: string) => {
      try {
        setIsLoading(true);
        if (!id) {
          const data = await getTours();
          setToursData(data);
          setIsLoading(false);
        } else {
          const data = await getToursById(id, exclude);
          setToursData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTours(id);
    }
    if (destinationId) {
      fetchTours(destinationId, exclude);
    }
    if (!id && !destinationId) {
      fetchTours();
    }
  }, [id, destinationId, exclude]);

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

  // Hàm hiển thị skeleton khi đang loading
  const renderLoadingSkeleton = () => (
    <div className="flex gap-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="min-w-[190px] md:min-w-[220px] lg:min-w-[250px]"
        >
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
      <h1 className=" text-2xl font-bold mb-4 text-[#F0298A]">
          {(toursData.length > 0 && destinationId ) ? "🌸Khám phá điểm đến" : ""}
        </h1>
      {/* Wrapper cho Embla */}
      <div className="overflow-hidden" ref={emblaRef}>
        
        <div className="flex p-2 space-x-4">
          {isLoading
            ? renderLoadingSkeleton()
            : toursData.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/tour/${tour.id}`}
                  className=""
                >
                  <div className=" max-w-[190px] md:max-w-[220px] lg:max-w-[250px] h-full hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white group">
                    <div className="overflow-hidden relative">
                      <div className="relative w-full h-[250px]">
                        <Image
                          src={tour.imageUrl}
                          alt={tour.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-md transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center font-semibold py-2">
                        {tour.destination.name}
                      </div>
                    </div>
                    <div className="p-2 ">
                      <h3 className="font-semibold truncate group-hover:text-primary">{tour.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                      </p>
                      {tour.discount && tour.discount > 0 ? (
                        <div>
                          <p className="text-xs font-medium text-gray-500 line-through">
                            {tour.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </p>
                          <p className="text-sm font-bold text-[#F96D01]">
                            {(
                              tour.price *
                              (1 - tour.discount / 100)
                            ).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-[#F96D01]">
                          {tour.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      {/* Chỉ hiển thị nút điều hướng khi số lượng phần tử lớn hơn 3 */}
      {toursData && toursData.length >= 4 && (
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

export default TourCarousel;
