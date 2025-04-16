import React, { useEffect, useState } from "react";
import { getReviewCheck, getReviewsByTourId } from "@/app/actions/review";
import { ReviewWithUserAndTour } from "@/types";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
interface ReviewProps {
  tourId: string;
  userId: string | undefined;
}
const Review = ({ tourId, userId }: ReviewProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [reviews, setReviews] = useState<ReviewWithUserAndTour[] | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchReviewCheck = async (tourId: string, userId: string) => {
      const data = await getReviewCheck(tourId, userId);
      if (data.allowed) {
        setIsChecked(true);
      }
    };
    
    if (tourId && userId) {
      fetchReviewCheck(tourId, userId);
    }
    fetchReviewBytourId(tourId);
  }, [tourId, userId]);
  const fetchReviewBytourId = async (tourId: string) => {
    const data = await getReviewsByTourId(tourId);
    setReviews(data);
  };
  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const starStats = Array.from({ length: 5 }, (_, i) => {
    const count = reviews?.filter((r) => r.rating === 5 - i).length;
    return { stars: 5 - i, count };
  });

  const handleSubmit = async () => {
    const data = {
      tourId,
      userId,
      rating,
      comment,
      imageUrl: "",
      imagePublicId: "",
    };
    if (files.length) {
      const uploadedImage = await handleUploadImage();
      if (!uploadedImage) {
        return;
      }
      data.imageUrl = uploadedImage.url;
      data.imagePublicId = uploadedImage.publicId;
    }
    try {
      setIsLoading(true);

      const response = await fetch("/api/review", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã gửi!");
      fetchReviewBytourId(tourId);
      setComment("");
      setFiles([]);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append("file", files[0]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Lỗi tải ảnh lên Cloudinary");
      const data = await res.json();
      const publicId = data.url.split("/").pop().split(".")[0];
      toast.success("Tải ảnh thành công!");
      return { url: data.url, publicId };
    } catch (error) {
      console.log(error);
      toast.error("Lỗi tải ảnh!");
    } finally {
      setIsLoading(false);
    }
  };
  const renderStars = (value: number, interactive = false) => {
    return [...Array(5)].map((_, i) => {
      const isFilled = interactive ? i < (hoverRating || rating) : i < value;

      return (
        <Star
          key={i}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onMouseEnter={() => interactive && setHoverRating(i + 1)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && setRating(i + 1)}
        />
      );
    });
  };
  return (
    <div className="space-y-4 md:w-2/3 w-full">
      <h2 className="text-2xl font-bold mt-2">Đánh giá & Bình luận</h2>
      <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-4xl font-bold text-yellow-400">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
          <span className="text-sm text-gray-500 ml-2">
            ({reviews?.length} đánh giá)
          </span>
        </div>

        <div className="space-y-1">
          {starStats.map(({ stars, count }) => (
            <div
              key={stars}
              className="flex items-center text-sm text-gray-600"
            >
              <div className="flex mr-2">{renderStars(stars)}</div>
              <span>{count} lượt</span>
            </div>
          ))}
        </div>
      </div>
      {isChecked ? (
        <Card className="">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center">{renderStars(rating, true)}</div>
            <Textarea
              disabled={isLoading}
              placeholder="Viết bình luận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <ImageUpload
              files={files}
              setFiles={setFiles}
              loading={isLoading}
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              Gửi đánh giá
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-500 font-semibold">
          Bạn không thể bình luận nếu chưa mua tour!
        </div>
      )}

      {!reviews ? (
        <div className="font-semibold text-center">
          Đang tìm kiếm bình luận...
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews &&
            reviews.map((r) => (
              <div key={r.id}>
                <div className="p-4 flex gap-4 items-start">
                  <Avatar>
                    <AvatarImage src={r.user.imageUrl || ""} />
                    <AvatarFallback>
                      {r.user.name && r.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold">{r.user.name}</div>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </p>
                    <div className="flex items-center">
                      {renderStars(r.rating)}
                    </div>
                    <p className="text-sm text-gray-700">{r.comment}</p>
                    {r.imageUrl && (
                      <div className="relative w-32 h-32 mt-2 rounded-md overflow-hidden border">
                        <Image
                          src={r.imageUrl}
                          alt="Hình ảnh đánh giá"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 font-semibold">
          Chưa có bình luận nào!
        </div>
      )}
    </div>
  );
};

export default Review;
