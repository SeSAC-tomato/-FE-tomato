"use client"
import PostHeader from "@/components/header/PostHeader"
import PageList from "@/components/PageList/PageList"
import PostsList from "@/components/PostList/PostsList"
import mockPosts from "@/utils/mock/mockPosts"
import { useState, useEffect } from "react"

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12
  const totalPage = Math.ceil(mockPosts.length / pageSize)

  const onPageListHandle = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff8177]">
      <PostHeader />
      <div className="mx-auto w-full max-w-4xl flex flex-col">
        <PostsList page={currentPage} pageSize={pageSize} />
        <PageList
          totalPage={totalPage}
          currentPage={currentPage}
          onPageListHandle={onPageListHandle}
        />
      </div>
    </div>
  )
}
