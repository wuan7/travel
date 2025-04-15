import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toLowerCase() || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const [countries, tours] = await Promise.all([
      prisma.country.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      }),
      prisma.tour.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          isDeleted: false, // chỉ lấy tour còn hoạt động
        },
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
        },
      }),
    ]);

    const formattedResults = [
      ...countries.map((c) => ({
        type: "country",
        id: c.id,
        name: c.name,
        imageUrl: c.imageUrl,
      })),
      ...tours.map((t) => ({
        type: "tour",
        id: t.id,
        name: t.name,
        imageUrl: t.imageUrl,
        price: t.price,
      })),
    ];

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
