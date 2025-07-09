"use client"
import { useState } from "react"
import LikeButton from "../button/LikeButton"
import {
  BASE_URL,
  ImageDisplayInfo,
  PostResponse,
  PostResponseWithImage,
} from "@/utils/domain/label"
import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { setFavorite } from "@/utils/api/post/api"

interface PostCardProps {
  post: PostResponseWithImage
}

export default function PostCard({ post }: PostCardProps) {
  const {
    id,
    title,
    price,
    region,
    productCategory,
    updatedAt,
    mainImage,
    isLiked,
  } = post
  const [currentIsLiked, setCurrentIsLiked] = useState<boolean>(isLiked)
  const timeAgo = formatDistanceToNow(parseISO(updatedAt), {
    addSuffix: true,
    locale: ko,
  })

  const handleLike = async () => {
    try {
      const response = await setFavorite(id)
      console.log(response)
      if (!response) return
      setCurrentIsLiked(response.isLiked)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 flex flex-col p-3">
        <Link
          href={`/posts/${id}`}
          className="block hover:shadow-lg transition"
        >
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
            {mainImage ? (
              <div key={mainImage.id} className="h-full rounded-lg">
                <img
                  src={`${BASE_URL}/api/v1/post/images/${mainImage.savedName}`}
                  alt="제품 이미지"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <img
                src={`https://picsum.photos/seed/item${id}/400/400`}
                alt={title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            )}
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
        <LikeButton isLiked={currentIsLiked} handleLike={handleLike} id={id} />
      </div>
    </>
  )
}
