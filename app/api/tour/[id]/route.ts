import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Lấy ID từ URL path
    if (!id)
      return NextResponse.json(
        { message: "Không tìm thấy id" },
        { status: 400 }
      );
    const tour = await prisma.tour.findUnique({ where: { id }, include: { schedules: true } });
    return NextResponse.json(tour);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy tour theo id" },
      { status: 500 }
    );
  }
}
