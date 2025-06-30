"use client"
import Filter from "@/components/filter/Filter"
import PostHeader from "@/components/header/PostHeader"
import PageList from "@/components/PageList/PageList"
import PostsList from "@/components/PostList/PostsList"
import { useState } from "react"

export default function Page() {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(100)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const handleLike = () => {
    setIsLiked(!isLiked)
  }
  const onPageListHandle = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className="relative w-full h-screen flex-col min-h-screen">
        <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
          <PostHeader />
          <Filter />
          <PostsList />
          <PageList
            totalPage={totalPage}
            currentPage={currentPage}
            onPageListHandle={onPageListHandle}
          />
        </div>
      </div>
    </>
  )
}
