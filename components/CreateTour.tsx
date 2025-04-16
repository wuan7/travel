"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdminModal } from "@/hooks/useAdminModal";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { getDestination } from "@/app/actions/destination";
import { Destination, Country } from "@prisma/client";
import ImageUpload from "./ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries } from "@/app/actions/country";
// Schema validation với Zod
const TourSchema = z.object({
  name: z.string().min(1, "Tên tour không được để trống"),
  description: z.string().min(10, "Mô tả ít nhất 10 ký tự"),
  price: z.string(),
  discount: z.string(),
  duration: z.string(),
  departure: z.string().min(1, "Điểm khởi hành không được để trống"),
  startDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
  destinationId: z.string().min(1, "Chọn điểm đến"),
  countryId: z.string().min(1, "Bạn phải chọn quốc gia"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  capacity: z.string().min(1, "Vui lòng nhập số người"),

});

type TourFormValues = z.infer<typeof TourSchema>;

const CreateTour = () => {
  const { isOpenCreateTour, closeCreateTour } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchDestinationAndRegions = async () => {
      try {
        setIsLoading(true);
        const data = await getDestination();
        const countriesData = await getCountries();
        console.log("destinations", data);
        console.log("countries", countriesData);
        setCountries(countriesData);
        setDestinations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationAndRegions();
  }, []);

  const form = useForm<TourFormValues>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      discount: "",
      duration: "",
      departure: "",
      startDate: new Date(),
      endDate: new Date(),
      destinationId: "",
      countryId: "",
      imageUrl: "",
      imagePublicId: "",
      capacity: "",
    },
  });

  const onSubmit = async (data: TourFormValues) => {
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh lên");
      return;
    }
    const uploadedImage = await handleUploadImage();
    if (!uploadedImage) {
      return;
    }
    data.imageUrl = uploadedImage.url;
    data.imagePublicId = uploadedImage.publicId;
    try {
      setIsLoading(true);
      const response = await fetch("/api/tour", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo Tour thành công!");
      form.reset();
      setFiles([]);
      closeCreateTour();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append("file", files[0]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Lỗi tải ảnh lên Cloudinary");
      const data = await res.json();
      const publicId = data.url.split("/").pop().split(".")[0];
      toast.success("Tải ảnh thành công!");
      return { url: data.url, publicId };
    } catch (error) {
      console.log(error);
      toast.error("Lỗi tải ảnh!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpenCreateTour} onOpenChange={closeCreateTour}>
      <DialogContent className="h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Thêm Tour mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Tour</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá (%)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian (ngày)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm khởi hành</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng người tham gia</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <ImageUpload
                  files={files}
                  setFiles={setFiles}
                  loading={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            {/* Loại khu vực */}
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quốc gia</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Set giá trị từ form
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((coun: Country) => (
                          <SelectItem key={coun.id} value={coun.id}>
                            {coun.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm đến</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Set giá trị từ form
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn điểm đến" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((des: Destination) => (
                          <SelectItem key={des.id} value={des.id}>
                            {des.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo Tour"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTour;
