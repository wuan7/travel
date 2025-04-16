"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import StickyBox from "react-sticky-box";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { getTourById } from "@/app/actions/tour";
import { Skeleton } from "@/components/ui/skeleton";
import { TourWithSchedules } from "@/app/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TourCarousel from "@/components/TourCarousel";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
import { useAdminModal } from "@/hooks/useAdminModal";
import CreateBooking from "@/components/CreateBooking";
import Review from "@/components/Review";
const TourSection = () => {
  const session = useSession();
  const { tourId } = useParams();
  const { openCreateBooking } = useAdminModal();
  const [tour, setTour] = useState<TourWithSchedules>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchdTour = async () => {
      try {
        setIsLoading(true);
        const tourData = await getTourById(tourId as string);
        setTour(tourData);
        console.log("tourData", tourData);
      } catch (error) {
        console.error("Error fetching tour id:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchdTour();
  }, [tourId]);

  const handleCreateBooking = () => {
      if(session.status !== "authenticated"){
        toast.warning("Vui lòng đăng nhập để đặt vé!");
        return;
      }
      if(tour?.capacity === 0){
        toast.warning("Xin lỗi vì vé đã hết!");
        return;
      }
      openCreateBooking();
  };
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-5">
        <div className="flex md:gap-x-5">
          <div className="w-full  md:w-2/3  rounded-sm">
            <Skeleton className="w-full  h-[50px] rounded-sm p-3 space-y-2 mb-5" />
            <Skeleton className="w-full  h-[500px] rounded-sm mt-5" />
          </div>
          <div className="hidden md:block md:w-1/3 h-[408px] rounded-sm ml-1">
            <Skeleton className="w-full  h-[290px] rounded-sm mt-5" />
            <Skeleton className="w-full  h-[110px] rounded-sm" />
          </div>
        </div>
      </div>
    );
  }
  if (!tour) {
    return <div className="max-w-6xl mx-auto p-5">Not found</div>;
  }
  return (
    <>
    <CreateBooking price={tour.discount && tour.discount > 0
  ? Math.floor(tour.price * (1 - tour.discount / 100))
  : tour.price} capacity={tour.capacity - tour.bookedSlots } tourId={tour.id}/>
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="font-bold text-primary text-3xl mb-6">{tour.name}</h1>
      <div className="flex md:flex-row items-start flex-col gap-2 md:gap-x-2">
        <div className="h-auto w-full md:w-2/3 ">
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md">
            <Image
              src={tour.imageUrl}
              alt={tour.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2 p-2">
            <h1 className="font-bold">Điểm nhấn lịch trình</h1>
            <Separator />
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Hành trình </p>
              <p>{tour.name}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Lịch trình </p>
              <p>{tour.duration} ngày</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Khởi hành</p>
              <p className="text-sm">
                {new Date(tour.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(tour.endDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <p className="italic">{tour.description}</p>
            <h2 className="text-xl font-bold mb-4 text-[#F0298A]">🌸Lịch trình chi tiết</h2>
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-2xl shadow-md border border-gray-100 bg-white"
            >
              {tour.schedules?.map((schedule) => (
              <AccordionItem
                key={schedule.id}
                value={schedule.id}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="px-4 py-3 text-xl font-bold cursor-pointer !no-underline  text-primary hover:text-primary/75  transition-colors">
                    Ngày {schedule.day} -  {schedule.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 text-gray-600 ">
                  {schedule.activity}
                </AccordionContent>
                
              </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <StickyBox offsetTop={52} offsetBottom={20} className="md:w-1/3 w-full">
          <div className="rounded-md w-full p-2 shadow-2xl shadow-primary">
            <div className="space-y-2">
              <h1 className="text-[#F0298A] font-bold blink-text" >{tour.name}</h1>

              <Separator />

              <div className="flex items-center gap-x-2">
                <p className="font-semibold">Mã tour</p>
                <p className="text-sm">{tour.id}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-x-2">
                <p className="font-semibold">Thời gian</p>
                <p className="text-sm">{tour.duration} ngày</p>
              </div>
              <Separator />
              <div className="flex items-center gap-x-2">
                <p className="font-semibold">Số lượng vé còn lại</p>
                <p className="text-sm">{tour.capacity - tour.bookedSlots} vé</p>
              </div>
              <Separator />
              <div className="flex items-center gap-x-2">
                <p className="font-semibold">Số vé đã đặt</p>
                <p className="text-sm">{tour.bookedSlots} vé</p>
              </div>
              <Separator />
              <div className="flex items-center gap-x-2">
                <p className="font-semibold">Khởi hành</p>
                <p className="text-sm">
                  {new Date(tour.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(tour.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <Separator />
              <div className="flex items-center gap-x-2">
                <p className="font-semibold">Xuất phát</p>
                <p className="text-sm">Từ {tour.departure}</p>
              </div>
              <Separator />
              {tour.discount && tour.discount > 0 ? (
                <div>
                  <div className="flex items-center gap-x-2">
                    <p className="font-semibold">Giá gốc:</p>
                    <p className=" font-medium line-through">
                      {tour.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <p className="font-semibold">Chỉ còn:</p>
                    <p className="font-bold text-[#F96D01] blink-text">
                      {(tour.price * (1 - tour.discount / 100)).toLocaleString(
                        "vi-VN",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <p className="font-semibold">Giá:</p>
                  <p className="text-xl font-bold blink-text">
                    {tour.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              )}
              <div>
                <Button className="w-full cursor-pointer" onClick={handleCreateBooking}>Đặt tour ngay</Button>
              </div>
            </div>
          </div>
        </StickyBox>
      </div>
      <div>
        <Review tourId={tour.id} userId={session?.data?.user?.id}/>
      </div>
        <div className="my-4">

        <TourCarousel destinationId={tour.destinationId} exclude={tour.id}/>
      </div>
    </div>
    </>
  );
};

export default TourSection;
