"use client";

import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  OAuthSignin: "Lỗi khi tạo URL xác thực. Vui lòng thử lại.",
  OAuthCallback: "Lỗi xử lý phản hồi từ OAuth provider.",
  OAuthCreateAccount: "Không thể tạo tài khoản với OAuth provider.",
  EmailCreateAccount: "Không thể tạo tài khoản bằng email.",
  Callback: "Lỗi xử lý callback từ OAuth.",
  OAuthAccountNotLinked: "Tài khoản email này đã được liên kết với một phương thức đăng nhập khác.",
  EmailSignin: "Gửi email xác thực thất bại.",
  CredentialsSignin: "Tên đăng nhập hoặc mật khẩu không chính xác.",
  SessionRequired: "Bạn cần đăng nhập để xem nội dung này.",
  Default: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
};
const SignInPage = () => {
   const searchParams = useSearchParams();
    const error = searchParams.get("error") || "Default";
    const errorMessage = errorMessages[error] || errorMessages["Default"];
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">Đăng Nhập</h1>
          {error && <p className="mt-2 text-red-500">{errorMessage}</p>}
          <form method="post" action="/api/auth/signin">
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Đăng nhập với OAuth
            </button>
          </form>
        </div>
      </div>
    );
}

export default SignInPage