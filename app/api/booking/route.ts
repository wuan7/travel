import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quantity, price, tourId, userId } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!quantity || !price || !tourId || !userId) {
      return NextResponse.json(
        { message: "Thiếu thông tin." },
        { status: 400 }
      );
    }

    console.log(quantity, price, tourId, userId);

    // Tạo khu vực trong database
    const booking = await prisma.booking.create({
      data: {
        quantity: parseInt(quantity),
        price: parseFloat(price),
        tourId,
        status: "pending",
        userId
      },
    })

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo booking:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo booking." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const booking = await prisma.booking.findMany({
    include: {
      tour: true,
      user: true,
    },
  });
  return NextResponse.json(booking);
}
