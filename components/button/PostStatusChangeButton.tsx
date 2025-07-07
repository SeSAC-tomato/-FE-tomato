"use client"
import React from "react"
import { PostStatus, postStatusLabelMap } from "@/utils/domain/label"

interface PostStatusChangeProps {
  postStatus: PostStatus
  onClick?: () => void
  className?: string
}

const PostStatusChangeButton: React.FC<PostStatusChangeProps> = ({
  postStatus,
  onClick,
  className = "",
}) => {
  const getNextLabel = (status: PostStatus) => {
    if (status === "SELLING") return postStatusLabelMap["BOOKED"]
    if (status === "BOOKED") return postStatusLabelMap["END"]
    if (status === "END") return postStatusLabelMap["END"]
    return null
  }

  const label = getNextLabel(postStatus)
  const isDisabled = postStatus === "END"
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`px-4 py-2 text-white text-1xl w-auto rounded-xl font-semibold transition-all
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-700 hover:bg-indigo-800"
        }
        ${className}`}
    >
      {label}으로 변경
    </button>
  )
}

export default PostStatusChangeButton
