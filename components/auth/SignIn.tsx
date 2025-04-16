import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useAuthModal } from "../../hooks/useAuthModal";
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
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
const SignIn = () => {
  const { authModal, closeModal, openRegister, openLogin } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Kiểm tra lỗi ngay khi nhập
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    console.log("Đăng nhập với:", values);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false, // Ngăn chặn redirect mặc định
    });
    setIsLoading(false);
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Email hoặc mât khẩu không chính xác.");
      }
      console.log("Lỗi khi đăng nhập:", result);
      return;
    }

    toast.success("Đăng nhập thành công!");
    // Đóng modal sau khi đăng nhập thành công
    closeModal();
  };

  const handleClose = () => {
    closeModal();
  };

  const switchAuth = () => {
    closeModal();
    if (authModal === "login") openRegister();
    else openLogin();
  };
  return (
    <div>
      <Dialog open={authModal === "login"} onOpenChange={handleClose}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Đăng nhập</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-primary"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
                <div className="flex items-center gap-2 my-4">
                  <hr className="flex-1 border-gray-300" />
                  <span className="text-sm text-gray-500">
                    Hoặc đăng nhập với
                  </span>
                  <hr className="flex-1 border-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    className="w-full cursor-pointer border  bg-[#D1F0FF] hover:bg-primary/40 text-[#024590]"
                    disabled={isLoading}
                    onClick={async () => {
                      await signIn("google");
                    }}
                  >
                    Google{" "}
                    <Image
                      src={"/img/google.svg"}
                      alt="google"
                      width={20}
                      height={20}
                    />
                  </Button>
                  
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Chưa có tài khoản?{" "}
                  <span
                    className="text-primary cursor-pointer font-semibold"
                    onClick={switchAuth}
                  >
                    Đăng ký ngay
                  </span>
                </p>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignIn;
