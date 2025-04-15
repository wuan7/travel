import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) return NextResponse.json([]);
  const tours = await prisma.tour.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive", // không phân biệt hoa thường
      },
    },
    take: 10,
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(tours);
}
