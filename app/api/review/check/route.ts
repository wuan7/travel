import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const tourId = searchParams.get("tourId");
  try {
    if (!userId || !tourId) {
      return NextResponse.json(
        { allowed: false, message: "Thiếu userId hoặc tourId" },
        { status: 400 }
      );
    }

    // Kiểm tra xem user đã booking tour này chưa và status confirmed
    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        tourId,
        status: "confirmed",
      },
    });

    if (!booking) {
      return NextResponse.json({
        allowed: false,
        message: "Bạn chưa đặt tour này hoặc chưa được xác nhận",
      });
    }

    // Kiểm tra xem đã review chưa
    //   const review = await prisma.review.findFirst({
    //     where: {
    //       userId,
    //       tourId,
    //     },
    //   });

    //   if (review) {
    //     return NextResponse.json({ allowed: false, message: "Bạn đã viết review cho tour này rồi" });
    //   }

    return NextResponse.json({ allowed: true });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
