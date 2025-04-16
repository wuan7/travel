import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { User } from "@prisma/client";
import Link from "next/link";
interface UserAvatarProps {
  data: Partial<User>;
}

const UserAvatar = ({ data }: UserAvatarProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer !outline-none">
          <p className="text-primary font-bold">{data.name}</p>
          <Avatar>
            <AvatarImage src={data.imageUrl || "/img/avatar.png"} />
            <AvatarFallback>{data.name && data?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Link href="/profile">Thông tin cá nhân</Link></DropdownMenuItem>
          <DropdownMenuItem><Link href="/ticket">Lịch sử mua vé</Link></DropdownMenuItem>
          {data.role === "ADMIN" && (
            <DropdownMenuItem><Link href="/admin">Trang quản trị</Link></DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => signOut()}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatar;
