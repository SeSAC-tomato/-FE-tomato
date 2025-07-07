"use client"
import React from "react"

interface PostPullButtonProps {
  onClick: () => void
}

const PostPullButton: React.FC<PostPullButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-1xl w-auto rounded-xl font-semibold transition-all`}
    >
      끌올하기
    </button>
  )
}

export default PostPullButton
