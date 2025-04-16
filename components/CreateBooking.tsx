"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useAdminModal } from "../hooks/useAdminModal";
import { useSession } from 'next-auth/react';
interface CreateBookingProps {
  price: number;     // đơn giá
  capacity: number;  // số vé tối đa có thể đặt
  tourId: string;

}

const CreateBooking = ({ price: unitPrice, capacity, tourId }: CreateBookingProps) => {
    const session = useSession();
  const { isOpenCreateBooking, closeCreateBooking } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);

  const BookingSchema = z.object({
    quantity: z
      .string()
      .min(1, "Số lượng vé không được để trống")
      .refine(
        (val) => {
          const parsed = parseInt(val, 10);
          return !isNaN(parsed) && parsed > 0 && parsed <= capacity;
        },
        {
          message: `Số lượng vé phải lớn hơn 0 và không vượt quá ${capacity}`,
        }
      ),
    price: z.number().min(1, "Tiền không được để trống"),
  });

  type BookingFormValues = z.infer<typeof BookingSchema>;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      quantity: "",
      price: unitPrice,
      
    },
  });

  const quantity = form.watch("quantity");

  useEffect(() => {
    const qty = parseInt(quantity || "0", 10);
    const newPrice = !isNaN(qty) && qty > 0 ? unitPrice * qty : unitPrice;
    form.setValue("price", newPrice);
  }, [quantity, unitPrice, form]);

  const onSubmit = async (data: BookingFormValues) => {
    if(!data.quantity || !tourId) {
        toast.error("Thiếu thông tin!");
        return;
    }
    try {
      setIsLoading(true);
      toast.success("Đang xử lý!");
      const booking = {
        quantity: data.quantity,
        price: data.price,
        tourId,
        userId: session.data?.user?.id
      }
      const bookingResponse = await fetch("/api/booking", {
        method: "POST",
        body: JSON.stringify(booking),
        headers: { "Content-Type": "application/json" },
      });

      if (!bookingResponse.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      const bookingData = await bookingResponse.json();
      const paymentData = {
        bookingId: bookingData.id,
        amount : data.price
      }
      const response = await fetch("/api/vnpay/create-payment-url", {
        method: "POST",
        body: JSON.stringify(paymentData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      toast.success("Đang điều hướng qua trang thanh toán, xin vui lòng chờ");
      const { url } = await response.json();
      window.location.href = url;

      form.reset();
      closeCreateBooking();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenCreateBooking} onOpenChange={closeCreateBooking}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt Tour</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Số lượng vé */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số lượng vé cần mua (tối đa {capacity} vé)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} max={capacity} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tổng tiền */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiền vé</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              Đặt tour
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBooking;
