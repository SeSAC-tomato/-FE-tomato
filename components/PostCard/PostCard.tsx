"use client"
import { useState } from "react"
import LikeButton from "../button/LikeButton"

export default function PostCard() {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const handleLike = () => {
    setIsLiked(!isLiked)
  }
  return (
    <>
      <div className="w-[235px] h-[333px] mx-[6px] my-2 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-start p-2">
        <div className="w-[210px] h-[216px] ml-1 border border-red-400">
          이미지
        </div>
        <div className="flex-col justify-start ml-2">
          <div className="flex items-center">
            <span>면바지</span>
            <LikeButton isLiked={isLiked} handleLike={handleLike} />
          </div>
          <div>10,000원</div>
          <div>신림동 끌올 2분전</div>
        </div>
      </div>
    </>
  )
}
