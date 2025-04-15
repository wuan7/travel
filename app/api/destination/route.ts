import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, imageUrl, countryId, imagePublicId } =
      body;

    if (
      !name ||
      !description ||
      !imageUrl ||
      !countryId ||
      !imagePublicId
    ) {
      return NextResponse.json({ message: "Thiếu thông tin" }, { status: 400 });
    }
    

    const destination = await prisma.destination.create({
      data: {
        name,
        description,
        imageUrl,
        imagePublicId,
        countryId,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo điểm đến" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const destinations = await prisma.destination.findMany();
    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy điểm đến" },
      { status: 500 }
    );
  }
}

