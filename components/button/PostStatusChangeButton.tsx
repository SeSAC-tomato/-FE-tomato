"use client"
import React from "react"
import { PostStatus, postStatusLabelMap } from "@/utils/domain/label"

interface PostStatusChangeProps {
  postStatusChange: PostStatus
  handleStatuschange: () => {}
}

const PostStatusChangeButton: React.FC<PostStatusChangeProps> = ({
  postStatusChange,
  handleStatuschange,
}) => {
  console.log(postStatusChange)
  const getNextLabel = (status: PostStatus) => {
    if (postStatusChange === "SELLING") return postStatusLabelMap["BOOKED"]
    if (postStatusChange === "BOOKED") return postStatusLabelMap["END"]
    if (postStatusChange === "END") return postStatusLabelMap["END"]
    return null
  }
  const label = getNextLabel(postStatusChange) ?? "알 수 없음"
  const isDisabled = postStatusChange === "END"
  return (
    <button
      onClick={handleStatuschange}
      disabled={isDisabled}
      className={`px-4 py-2 text-white text-1xl w-auto rounded-xl font-semibold transition-all
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
    >
      {postStatusChange === "END" ? label : `${label}(으)로 변경`}
    </button>
  )
}

export default PostStatusChangeButton
