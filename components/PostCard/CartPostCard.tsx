// components/PostCard/CartPostCard.tsx
"use client";
import { CartPost } from "@/utils/type/mypage/type";
import LikeButton from "../button/LikeButton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDate } from "@/utils/domain/label";
import { BASE_URL } from "@/utils/domain/label";

interface CartPostCardProps {
  post: CartPost;
  onUnlike?: () => void; // 찜 해제 기능이 필요하다면
}

export default function CartPostCard({ post, onUnlike }: CartPostCardProps) {
  // 하트는 항상 채워진 상태
  console.log("이미지 URL:", `${BASE_URL}/api/v1/post/images/${post.img}`);

  return (
    <div className="w-[235px] h-[333px] mx-[6px] my-2 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-start p-2">
      <Link
        href={`/posts/${post.postId}`}
        className="block"
        onClick={() => console.log("이동할 postId:", post.postId)}
      >
        <div className="w-[210px] h-[216px] ml-1 border border-red-400">
          {post.img ? (
            <img
              src={
                post.img.startsWith("/api/")
                  ? `${BASE_URL}${post.img}`
                  : `${BASE_URL}/api/v1/post/images/${post.img}`
              }
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
          </div>
          <div>{post.price.toLocaleString()}원</div>
          <div>{formatDate(post.createdAt)}</div>
        </div>
      </Link>
      <LikeButton isLiked={true} handleLike={onUnlike || (() => {})} />
    </div>
  );
}
