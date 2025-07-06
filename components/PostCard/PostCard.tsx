"use client"
import { useState } from "react"
import LikeButton from "../button/LikeButton"
import { PostResponse } from "@/utils/domain/label"
import Link from "next/link"

interface PostCardProps {
  post: PostResponse
}

export default function PostCard({ post }: PostCardProps) {
  const {
    id,
    title,
    price,
    region,
    productCategory,
    updatedAt,
    imageUrl,
    isLiked: initialIsLiked = false,
  } = post

  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked)
  const handleLike = () => setIsLiked((prev) => !prev)

  return (
    <>
      <Link href={`/posts/${id}`} className="block hover:shadow-lg transition">
        <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 flex flex-col p-3">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
            <img
              src={imageUrl ?? `https://picsum.photos/seed/item${id}/400/400`}
              alt={title}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col mt-3 gap-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold truncate max-w-[75%]">
                {title}
              </h3>
              <LikeButton isLiked={isLiked} handleLike={handleLike} />
            </div>
            <div className="text-[#e53935] font-extrabold text-xl">
              {price.toLocaleString()}원
            </div>
            <div className="text-gray-500 text-sm truncate">
              {region ?? "구로동"} · {productCategory} ·{" "}
              {updatedAt.slice(0, 10)}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
