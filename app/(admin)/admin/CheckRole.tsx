"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const CheckRole = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as User;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    } else if (status === "authenticated" && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [status, user, router]);
  return <div></div>;
};

export default CheckRole;
