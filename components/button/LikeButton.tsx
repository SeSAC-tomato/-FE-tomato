"use client"
import { LikeButtonProps } from "@/utils/type/post/type"
import HeartIcon from "../icons/HeartIcon"

export default function LikeButton({
   isCurrentLiked,
   isLiked,
   handleLike,
    postId
}: LikeButtonProps) {
  const likedColor = "#FEE500" // red-400
  const defaultColor = "#CCCCCC" // gray-200
  return (
    <>
      <button onClick={handleLike}>
        <HeartIcon color={(isLiked || isCurrentLiked) ? likedColor : defaultColor} />
      </button>
    </>
  )
}
