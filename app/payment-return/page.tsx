// app/payment-return/page.tsx
"use client";

import {  useLayoutEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader, XCircle } from "lucide-react";
import { BookingWithTour } from "../types";
import { getBookingById } from "../actions/booking";

const PaymentReturnPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [booking, setBooking] = useState<BookingWithTour>(
    {} as BookingWithTour
  );
  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const responseSuccess = searchParams.get("success");
    const responseBookingId = searchParams.get("bookingId");

    const isSuccess =
      responseCode === "00" && responseSuccess === "true" && responseBookingId;

    setSuccess(!!isSuccess);

    if (isSuccess) {
      const fetchdTour = async () => {
        try {
          setIsLoading(true);
          const bookingData = await getBookingById(responseBookingId);
          setBooking(bookingData);
        } catch (error) {
          console.error("Error fetching booking id:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchdTour();
    }
  }, [searchParams, router]);

  useLayoutEffect(() => {
    if (success) {
      const end = Date.now() + 15 * 1000;
      const colors = ["#22c55e", "#3b82f6"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [success]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {success === null ? (
        <p>Đang kiểm tra trạng thái thanh toán...</p>
      ) : success && booking ? (
        <div className="flex flex-col items-center">
          <CheckCircle size={64} className="text-green-600" />
          <h1 className="text-2xl font-bold mt-4 text-green-600">
            Thanh toán thành công!
          </h1>
          {booking ? (
            <div className="my-3 shadow-2xl p-5 space-y-1.5">
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Mã thanh toán:</p>
                <p className="text-sm font-semibold">{booking.id}</p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Trạng thái:</p>
                <p className="text-sm font-semibold">
                  {booking.status === "confirmed"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Tổng tiền:</p>
                <p className="text-sm font-semibold">
                  {" "}
                  {booking.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Số lượng vé:</p>
                <p className="text-sm font-semibold">{booking.quantity} vé</p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Thời gian thanh toán:</p>
                <p className="text-sm font-semibold">
                  {new Date(booking.bookedAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">
                  Thời gian bắt đầu Tour:
                </p>
                <p className="text-sm font-semibold">
                  {new Date(booking.tour?.startDate).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">
                  Thời gian kết thúc Tour:
                </p>
                <p className="text-sm font-semibold">
                  {new Date(booking.tour?.endDate).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Tour:</p>
                <p className="text-sm font-semibold">{booking.tour?.name}</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-bold text-red-600">
                Không tìm thấy thông tin tour.
              </h1>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 p-10">
              <Loader className="size-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-red-600 flex items-center flex-col">
          <XCircle size={64} />
          <h1 className="text-2xl font-bold mt-4">
            {!booking ? "Có lỗi xảy ra" : "Thanh toán không thành công"}
          </h1>
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentReturnPage;
