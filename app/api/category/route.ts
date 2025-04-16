import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
      return NextResponse.json(
        { message: "Tên là bắt buộc." },
        { status: 400 }
      );
    }

    // Tạo khu vực trong database
    const category = await prisma.category.create({
      data: {
        name,
      },
    })

    return NextResponse.json(category, { status: 201 });
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
      const categories = await prisma.category.findMany({
        include: { countries: true },
      });
  
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách category:", error);
      return NextResponse.json(
        { message: "Có lỗi xảy ra khi lấy danh sách category." },
        { status: 500 }
      );
    }
  }
