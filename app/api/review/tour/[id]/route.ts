import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const reviews = await prisma.review.findMany({
            where: {
                tourId: id,
            },
            include: {
                user: true,
                tour: true
            },
        });
        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Lỗi khi lấy review" },
            { status: 500 }
        );
    }
}