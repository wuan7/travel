import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, day, activity, tourId } =
      body;

    if (
      !title ||
      !day ||
      !activity ||
      !tourId 
    ) {
      return NextResponse.json({ message: "Thiếu thông tin" }, { status: 400 });
    }
    

    const schedule = await prisma.schedule.create({
      data: {
        title,
        day : parseInt(day),
        activity,
        tourId
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo lịch trình" },
      { status: 500 }
    );
  }
}
