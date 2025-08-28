"use client"
import { useState } from "react"
import LikeButton from "../button/LikeButton"
import {
  BASE_URL,
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
    updatedAt,
    mainImage,
    isLiked,
    numberOfLikes,
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
            <div className="flex flex-row justify-baseline items-center mb-1">
              <div className="text-gray-500 text-sm truncate mr-2">
                {region ?? "구로동"}
              </div>
              <div className="text-gray-500 text-sm truncate  mr-2">
                {timeAgo}
              </div>
              <div className="flex flex-row justify-baseline items-center">
                <div className="text-gray-700 bold text-sm truncate  mr-1">
                  찜
                </div>
                <div className="text-red-500 text-sm truncate  mr-2">
                  {numberOfLikes}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <LikeButton isCurrentLiked={currentIsLiked} handleLike={handleLike} />
      </div>
    </>
  )
}
