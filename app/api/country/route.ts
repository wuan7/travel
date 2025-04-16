import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, imageUrl, continentId, imagePublicId, categories, description } =
      body;

    if (
      !name ||
      !continentId ||
      !imageUrl ||
      !imagePublicId ||
      !description
    ) {
      return NextResponse.json({ message: "Thiếu thông tin" }, { status: 400 });
    }

    const destination = await prisma.country.create({
      data: {
        name,
        imageUrl,
        imagePublicId,
        continentId,
        description,
        categories: categories?.length ?{
            connect: categories.map((categoryId: string) => ({ id: categoryId })), // Liên kết category với destination
          } : undefined,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo quốc gia" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const continentId = searchParams.get("continentId");

  try {
    
    if (categoryId) {
      const countries = await prisma.country.findMany({
        where: {
          categories: {
            some: {
              id: categoryId,
            },
          },
        }
        
      });

      return NextResponse.json(countries, { status: 200 });
    } 
    
    if (continentId) {
      const countries = await prisma.country.findMany({
        where: {
          continentId,
        }
        
      });

      return NextResponse.json(countries, { status: 200 });
    }

    const countries = await prisma.country.findMany();
    return NextResponse.json(countries, { status: 200 });

  } catch (error) {
    console.error("Lỗi khi lấy country:", error);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}