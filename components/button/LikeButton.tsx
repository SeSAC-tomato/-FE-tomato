"use client"
import { LikeButtonProps } from "@/utils/type/post/type"
import HeartIcon from "../icons/HeartIcon"

export default function LikeButton({
    isCurrentLiked,
   handleLike,
}: LikeButtonProps) {
    console.log("페이지의 Like",isCurrentLiked )
  const likedColor = "#FEE500" // red-400
  const defaultColor = "#CCCCCC" // gray-200
  return (
    <>
      <button onClick={handleLike}>
        <HeartIcon color={ isCurrentLiked ? likedColor : defaultColor} />
      </button>
    </>
  )
}
