"use client"
import { LikeButtonProps } from "@/utils/type/post/type"
import HeartIcon from "../icons/HeartIcon"
import { setFavorite } from "@/utils/api/post/api"

export default function LikeButton({
  isLiked,
  fillColor = "#FEE500",
  handleLike,
  id,
}: LikeButtonProps) {
  const likedColor = fillColor // red-400
  const defaultColor = "#CCCCCC" // gray-200
  return (
    <>
      <button onClick={handleLike}>
        <HeartIcon color={isLiked ? likedColor : defaultColor} />
      </button>
    </>
  )
}
