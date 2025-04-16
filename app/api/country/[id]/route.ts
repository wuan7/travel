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
    const country = await prisma.country.findUnique({
      where: { id },
    });
    return NextResponse.json(country);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy quốc gia theo id" },
      { status: 500 }
    );
  }
}