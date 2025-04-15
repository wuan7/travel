import React, { useState } from "react";
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
import { useAdminModal } from "@/app/hooks/useAdminModal";
// Schema validation với Zod
const ContinentSchema = z.object({
  name: z.string().min(1, "Tên khu vực không được để trống"),
  
});

type ContinentFormValues = z.infer<typeof ContinentSchema>;

const CreateContinent = () => {
  const { isOpenCreateContinent, closeCreateContinent } = useAdminModal();
const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ContinentFormValues>({
    resolver: zodResolver(ContinentSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ContinentFormValues) => {
    console.log("Dữ liệu đã nhập:", data);

    try {
      setIsLoading(true);
      const response = await fetch("/api/continent", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo khu vực thành công!"); // Hiển thị thông báo
      form.reset(); // Reset form sau khi submit
      closeCreateContinent();
    } catch (error) {
      console.log(error)
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      

      {/* Dialog hiển thị form */}
      <Dialog open={isOpenCreateContinent} onOpenChange={closeCreateContinent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm khu vực mới</DialogTitle>
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
                    <FormLabel>Tên khu vực</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Nút submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                Tạo khu vực
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateContinent;
