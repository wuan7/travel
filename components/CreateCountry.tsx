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
import ImageUpload from "./ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getContinents } from "@/app/actions/continent";
import { Category, Continent } from "@prisma/client";
import { getCategories } from "@/app/actions/category";
import { Textarea } from "@/components/ui/textarea";
// Schema validation với Zod
const CountrySchema = z.object({
  name: z.string().min(1, "Tên khu vực không được để trống"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  continentId: z.string().min(1, "Bạn phải chọn khu vực"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  categories: z.array(z.string()),
});

type CountryFormValues = z.infer<typeof CountrySchema>;

const CreateCountry = () => {
  const { isOpenCreateCountry, closeCreateCountry } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      imagePublicId: "",
      continentId: "",
      description: "",
      categories: [],
    },
  });

  useEffect(() => {
    const fetchContinentsAndCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getContinents();
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse);
        setContinents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContinentsAndCategories();
  }, []);

  const onSubmit = async (data: CountryFormValues) => {
    console.log("Dữ liệu đã nhập:", data);
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
      const response = await fetch("/api/country", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo quốc gia thành công!"); // Hiển thị thông báo
      form.reset(); // Reset form sau khi submit
      setFiles([]);
      closeCreateCountry();
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
    <>
      {/* Dialog hiển thị form */}
      <Dialog open={isOpenCreateCountry} onOpenChange={closeCreateCountry}>
        <DialogContent className="h-[80vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Thêm quốc gia mới</DialogTitle>
          </DialogHeader>

          {/* Form sử dụng React Hook Form + Shadcn */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tên khu vực */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên quốc gia</FormLabel>
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

              <FormField
                control={form.control}
                name="continentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại khu vực</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value} // Set giá trị từ form
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn khu vực" />
                        </SelectTrigger>
                        <SelectContent>
                          {continents.map((cont: Continent) => (
                            <SelectItem key={cont.id} value={cont.id}>
                              {cont.name}
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
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    {categories.map((category: Category) => (
                      <FormControl key={category.id}>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={category.id}
                            checked={field.value.includes(category.id)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              field.onChange(
                                isChecked
                                  ? [...field.value, category.id] // Thêm vào danh sách nếu được chọn
                                  : field.value.filter(
                                      (id: string) => id !== category.id
                                    ) // Loại bỏ nếu bỏ chọn
                              );
                            }}
                          />
                          <span>{category.name}</span>
                        </label>
                      </FormControl>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nút submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                onClick={() => onSubmit(form.getValues())}
              >
                Tạo khu vực
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCountry;
