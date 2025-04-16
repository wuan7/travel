import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAdminModal } from "../hooks/useAdminModal";
import { Tour } from "@prisma/client";
import { getTours } from "../app/actions/tour";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
const ScheduleSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  day: z.string().min(1, "Ngày nhập phải nhiều hơn 1 ký tự"),
  activity: z.string().min(1, "Hành động không được để trống"),
  tourId: z.string().min(1, "Bạn phải chọn tour id"),
});

type ScheduleFormValues = z.infer<typeof ScheduleSchema>;
const CreateSchedule = () => {
  const { isOpenCreateSchedule, closeCreateSchedule } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      title: "",
      day: "",
      activity: "",
      tourId: "",
    },
  });
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const data = await getTours();
        setTours(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);
  const onSubmit = async (data: ScheduleFormValues) => {
    console.log("Dữ liệu đã nhập:", data);

    try {
      setIsLoading(true);
      const response = await fetch("/api/schedule", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo lịch tình thành công!");
      form.reset();
      closeCreateSchedule();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Dialog hiển thị form */}
      <Dialog open={isOpenCreateSchedule} onOpenChange={closeCreateSchedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm lịch trình tour</DialogTitle>
          </DialogHeader>

          {/* Form sử dụng React Hook Form + Shadcn */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tên khu vực */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày của hành trình</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hoạt động</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tourId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value} // Set giá trị từ form
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn tour" />
                        </SelectTrigger>
                        <SelectContent>
                          {tours.map((tour: Tour) => (
                            <SelectItem key={tour.id} value={tour.id}>
                              {tour.name} - {tour.duration} ngày
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nút submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                Tạo lịch trình
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateSchedule;
