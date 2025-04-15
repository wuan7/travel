"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminModal } from "@/app/hooks/useAdminModal";
import { Country } from "@prisma/client";
import ImageUpload from "./ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries } from "@/app/actions/country";
export const DestinationSchema = z.object({
  name: z.string().min(1, "Tên điểm đến không được để trống"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  countryId: z.string().min(1, "Bạn phải chọn quốc gia"),
  
});
const CreateDestination = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { isOpenCreateDestination, closeCreateDestination } = useAdminModal();
  const form = useForm({
    resolver: zodResolver(DestinationSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      imagePublicId: "",
      countryId: "",
      
    },
  });
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);
  const onSubmit = async (values: z.infer<typeof DestinationSchema>) => {
    
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh lên");
      return;
    }
    const uploadedImage = await handleUploadImage();
    if (!uploadedImage) {
      return;
    }
    values.imageUrl = uploadedImage.url;
    values.imagePublicId = uploadedImage.publicId;

    try {
      setIsLoading(true);
      const res = await fetch("/api/destination", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi tạo điểm đến");
      toast.success("Tạo điểm đến thành công!");
      form.reset();
      setFiles([]);
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
    <Dialog
      open={isOpenCreateDestination}
      onOpenChange={closeCreateDestination}
    >
      <DialogContent className="h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Thêm điểm đến mới</DialogTitle>
        </DialogHeader>

        {/* Form sử dụng React Hook Form + Shadcn */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên điểm đến</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên" />
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
                    <Textarea {...field} placeholder="Nhập mô tả" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            
            
            <Button
              type="submit"
              disabled={isLoading}
              onClick={() => onSubmit(form.getValues())}
            >
              {isLoading ? "Đang tạo..." : "Tạo điểm đến"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDestination;
