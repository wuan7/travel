import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
      return NextResponse.json(
        { message: "Tên và loại khu vực là bắt buộc." },
        { status: 400 }
      );
    }

    // Tạo khu vực trong database
    const region = await prisma.continent.create({
      data: {
        name,
      },
    });

    return NextResponse.json(region, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo khu vực:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo khu vực." },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const regions = await prisma.continent.findMany({
        include: { countries: true, articles: {
          include: {
            user: true,
          },
        }, },
      });
  
      return NextResponse.json(regions, { status: 200 });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khu vực:", error);
      return NextResponse.json(
        { message: "Có lỗi xảy ra khi lấy danh sách khu vực." },
        { status: 500 }
      );
    }
  }
