"use client";
import { useState } from "react";
import { Post } from "@/utils/type/mypage/type";

interface MyPostCardProps {
  post: Post;
}

export default function MyPostCard({ post }: MyPostCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeSort, setLikeSort] = useState<
    "LIKE_CREATED_AT" | "POST_CREATED_AT" | "PRICE" | "POPULARITY"
  >("LIKE_CREATED_AT");

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  return (
    <>
      <div className="w-[235px] h-[333px] mx-[6px] my-2 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-start p-2">
        <div className="w-[210px] h-[216px] ml-1 border border-red-400">
          {post.img ? (
            <img
              src={post.img}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              이미지 없음
            </div>
          )}
        </div>
        <div className="flex-col justify-start ml-2">
          <div className="flex items-center">
            <span>{post.title}</span>
            {/* <LikeButton isLiked={isLiked} handleLike={handleLike} /> */}
          </div>
          <div>{post.price.toLocaleString()}원</div>
          <div>{formatDate(post.createdAt)}</div>
        </div>
      </div>
    </>
  );
}
