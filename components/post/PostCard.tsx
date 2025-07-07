"use client"
import { useState } from "react"
import LikeButton from "../button/LikeButton"
import { PostResponse } from "@/utils/domain/label"
import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { setFavorite } from "@/utils/api/post/api"

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
  const handleLike = async () => {
    setIsLiked((prev) => !prev) //이 부분 차후 수정처리 필요함
    // try {
    //   const response = await setFavorite(id)

    // } catch (error) {
    //   console.log(error)
    // }
  }
  const timeAgo = formatDistanceToNow(parseISO(updatedAt), {
    addSuffix: true,
    locale: ko,
  })
  return (
    <>
      <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 flex flex-col p-3">
        <Link
          href={`/posts/${id}`}
          className="block hover:shadow-lg transition"
        >
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
            </div>
            <div className="text-[#e53935] font-extrabold text-xl">
              {price.toLocaleString()}원
            </div>
            <div className="text-gray-500 text-sm truncate">
              {region ?? "구로동"} · {timeAgo}
            </div>
          </div>
        </Link>
        <LikeButton isLiked={isLiked} handleLike={handleLike} />
      </div>
    </>
  )
}
