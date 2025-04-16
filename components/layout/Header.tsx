"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuthModal } from "../../hooks/useAuthModal";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import UserAvatar from "../UserAvatar";

type SessionUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role:"USER" | "ADMIN";
};
const Header = () => {
  const { openLogin, openRegister } = useAuthModal();
  const session = useSession();
  console.log("session", session);
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 h-[56px]">
        <Link href="/">
          <div className="relative w-[135px] h-[45px]">
            <Image
              src="/img/Travel.png"
              alt="logo"
              fill
              className="object-cover"
            />
          </div>
        </Link>
        {session.status !== "authenticated" && (
          <div className="hidden md:flex md:gap-x-1.5">
            <Button
              onClick={openLogin}
              className="!bg-white border !border-primary text-black hover:cursor-pointer "
            >
              <User className="text-primary" />
              Đăng nhập
            </Button>
            <Button
              onClick={openRegister}
              className="bg-primary hover:bg-primary/90 text-white hover:cursor-pointer "
            >
              Đăng ký
            </Button>
          </div>
        )}
        {session?.data?.user ? (
          <UserAvatar data={session.data.user as SessionUser} />
        ) : null}
      </div>
    </header>
  );
};

export default Header;
