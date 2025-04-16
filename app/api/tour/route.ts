import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";



export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Kiểm tra dữ liệu đầu vào
    const {name, price, startDate, endDate, departure, destinationId, duration, discount, description, imageUrl, imagePublicId, countryId, capacity} = body

    if (!name || !price || !startDate || !endDate || !departure || !destinationId || !duration || !description || !imageUrl || !imagePublicId || !countryId || !capacity) {
      return NextResponse.json({ error: "Thieu thong tin" }, { status: 400 });
    }


    // Tạo tour mới trong database
    const newTour = await prisma.tour.create({
      data: {
        name,
        price: parseFloat(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        departure,
        destinationId,
        countryId,
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        discount: discount ? parseFloat(discount) : 0,
        description,
        imageUrl,
        imagePublicId
      },
    });

    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo tour:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const excludeId = searchParams.get("exclude");
  if (!id) {
    const tours = await prisma.tour.findMany({
      include: {
        destination: true,
      },
    });
    return NextResponse.json(tours, { status: 200 });
  }

  try {
    const tours = await prisma.tour.findMany({
      where: {
        OR: [
          { destinationId: id },
          { countryId: id },
        ],
        NOT: {
          id: excludeId || undefined,
        },
      },
      include: {
        destination: true,
      }
    });

    return NextResponse.json(tours, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy tour theo id:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}