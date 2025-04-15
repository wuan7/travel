"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPostById } from "@/app/actions/post";
import { ArticleWithUser } from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

const PostSection = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<ArticleWithUser>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const postData = await getPostById(postId as string);
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post id:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="w-full ">
          <Skeleton className="w-full h-10 rounded-lg mb-4" />
          <Skeleton className="w-full h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto h-[80vh] px-4 py-8 text-center font-bold">
        Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-900">
        {post.title}
      </h1>

      <div className="text-sm text-gray-500 mb-6 flex flex-wrap gap-x-4">
        <span>👤 {post.user.name}</span>
        <span>🕒 {post.readingTime} phút đọc</span>
      </div>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-md">
        <Image
          src={post.imageUrl || ""}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <article
        className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostSection;
