import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import readingTime from "reading-time";
export async function POST(req: Request) {

  try {
    const body = await req.json();
    const { title, content, imageUrl, continentId, imagePublicId, userId } = body;
    
    if (
      !title ||
      !content ||
      !imageUrl ||
      !continentId ||
      !imagePublicId ||
      !userId
    ) {
      return NextResponse.json({ message: "Thiếu thông tin" }, { status: 400 });
    }
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const baseSlug = slugify(title, {
      locale: "vi",
      lower: true,
      strict: true,
    });
    const slug = `${baseSlug}-${randomSuffix}`;

    const stats = readingTime(content);
    const reading = Math.ceil(stats.minutes);
    const destination = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl,
        imagePublicId,
        continentId,
        slug,
        readingTime: reading,
        userId
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo bài viết" },
      { status: 500 }
    );
  }
}
