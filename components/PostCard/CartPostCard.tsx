// components/PostCard/CartPostCard.tsx
"use client";
import { CartPost } from "@/utils/type/mypage/type";
import LikeButton from "../button/LikeButton";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CartPostCardProps {
  post: CartPost;
  onUnlike?: () => void; // 찜 해제 기능이 필요하다면
}

export default function CartPostCard({ post, onUnlike }: CartPostCardProps) {
  // 하트는 항상 채워진 상태
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
                post.img?.startsWith("http")
                  ? post.img
                  : `http://localhost:8080${post.img}`
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
      <LikeButton isLiked={true} handleLike={onUnlike} />
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );
  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  return `${Math.floor(diffInMinutes / 1440)}일 전`;
}
