import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy review" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, userId, comment, rating, imageUrl, imagePublicId } = body;
    if (!tourId || !userId || !comment || !rating) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }
    const review = await prisma.review.create({
      data: {
        tourId,
        userId,
        comment,
        rating,
        imageUrl,
        imagePublicId,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo review" },
      { status: 500 }
    );
  }
}
