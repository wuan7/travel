"use client";
import React, { useEffect, useState } from "react";
import { BookingWithTour } from "../types";
import { getBookingByUserId } from "../actions/booking";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Loader, CheckCircle, XCircle } from "lucide-react";

const Page = () => {
  const session = useSession();
  const [booking, setBooking] = useState<BookingWithTour[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async (id: string) => {
      try {
        setIsLoading(true);
        const bookingData = await getBookingByUserId(id);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking id:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (session.data?.user?.id) {
      fetchBooking(session.data.user.id);
    }
  }, [session.data]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-2">
        <Loader className="size-8 text-primary animate-spin" />
        <p className="text-sm text-gray-500">Đang tải lịch sử đặt vé...</p>
      </div>
    );
  }

  if (booking && booking.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">
        Bạn chưa có giao dịch nào!
      </div>
    );
  }

  return (
    <div className="my-10 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Lịch sử đặt vé
      </h1>

      <div className="space-y-5">
        {booking?.map((tour) => (
          <Link
            key={tour.id}
            href={`/tour/${tour.tour.id}`}
            className="block"
          >
            <div className="flex gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">
              <div className="relative w-24 h-32 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={tour.tour.imageUrl}
                  alt={tour.tour.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {tour.tour.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Giá:{" "}
                    <span className="text-gray-700 font-medium">
                      {tour.price?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng:{" "}
                    <span className="text-gray-700">{tour.quantity} vé</span>
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    Ngày đặt:{" "}
                    <span className="text-gray-700">
                      {new Date(tour.bookedAt).toLocaleString("vi-VN")}
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {tour.status === "confirmed" ? (
                      <>
                        <CheckCircle className="text-green-500 w-4 h-4" />
                        <span className="text-green-600">Thành công</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500 w-4 h-4" />
                        <span className="text-red-600">Thất bại</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
