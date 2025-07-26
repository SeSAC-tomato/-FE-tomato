"use client";
import { useState } from "react";
import { CartPost } from "@/utils/type/mypage/type";
import Link from "next/link";
import { formatDate, BASE_URL } from "@/utils/domain/label";

interface MyPostCardProps {
  post: CartPost;
}

export default function MyPostCard({ post }: MyPostCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeSort, setLikeSort] = useState<
    "LIKE_CREATED_AT" | "POST_CREATED_AT" | "PRICE" | "POPULARITY"
  >("LIKE_CREATED_AT");

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/posts/${post.postId}`}>
      <div className="w-[235px] h-[333px] mx-[6px] my-2 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-start p-2">
        <div className="w-[210px] h-[216px] ml-1 border border-red-400">
          {post.img ? (
            <>
              {console.log(
                "이미지 URL:",
                `${BASE_URL}/api/v1/post/images/${post.img}`
              )}
              <img
                src={
                  post.img.startsWith("/api/")
                    ? `${BASE_URL}${post.img}`
                    : `${BASE_URL}/api/v1/post/images/${post.img}`
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </>
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
    </Link>
  );
}
