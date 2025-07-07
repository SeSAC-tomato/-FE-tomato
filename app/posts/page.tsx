"use client"
import PostHeader from "@/components/header/PostHeader"

import { useState, useEffect, useCallback } from "react"
import {
  PostResponse,
  PostSearchFilter,
  ProductCategory,
} from "@/utils/domain/label"
import { getPosts } from "@/utils/api/post/api"
import Link from "next/link"
import AddIcon from "@/components/icons/AddIcon"
import PostsList from "@/components/post/PostsList"
import PageList from "@/components/post/PageList"

export default function Page() {
  const pageSize = 12
  const [currentPage, setCurrentPage] = useState(0) // 0-based 페이지 번호
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [productCategory, setProductCategory] = useState<
    ProductCategory | undefined
  >(undefined)
  const [selling, setSelling] = useState<boolean | undefined>(undefined)
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [region, setRegion] = useState<string>("")

  // API 호출 함수
  const getPostsData = useCallback(
    async (page: number) => {
      setLoading(true)
      setError(null)
      try {
        const searchFilter: PostSearchFilter = {
          searchKeyword: searchKeyword || undefined,
          productCategory: productCategory || undefined,
          selling: selling || undefined,
          minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        }
        const responseData = await getPosts(page, pageSize, searchFilter)
        if (responseData.success && responseData.data) {
          const { posts, totalPages } = responseData.data
          setPosts(posts)
          setTotalPages(totalPages)
        } else {
          setError(
            responseData.error?.message || "알 수 없는 오류가 발생했습니다."
          )
          setPosts([])
          setTotalPages(0)
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `데이터 로딩 중 오류 발생: ${err.message}`
            : "알 수 없는 오류가 발생했습니다."
        )
        setPosts([])
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    },
    [searchKeyword, productCategory, selling, minPrice, maxPrice, pageSize]
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    getPostsData(currentPage)
  }, [currentPage, getPostsData])

  useEffect(() => {
    setCurrentPage(0)
  }, [searchKeyword, productCategory, selling, minPrice, maxPrice])

  const onPageListHandle = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff8177]">
      <PostHeader
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        productCategory={productCategory}
        setProductCategory={setProductCategory}
        selling={selling}
        setSelling={setSelling}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        region={region}
        setRegion={setRegion}
      />
      <div className="mx-auto w-full max-w-4xl flex flex-col">
        <PostsList posts={posts} loading={loading} error={error} />
        <PageList
          totalPages={totalPages}
          currentPage={currentPage}
          onPageListHandle={onPageListHandle}
        />
      </div>
      <Link href="posts/new" passHref>
        <button
          className="fixed bottom-6 right-6
                     bg-orange-600 hover:bg-orange-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     text-white p-4 rounded-full shadow-lg text-lg font-bold transition-all duration-200 ease-in-out transform hover:scale-105
                     flex items-center justify-center
                     z-50"
        >
          <AddIcon />
          <span className="ml-2 hidden sm:inline">글쓰기</span>{" "}
        </button>
      </Link>
    </div>
  )
}
