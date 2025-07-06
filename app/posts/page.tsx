"use client"
import PostHeader from "@/components/header/PostHeader"
import PageList from "@/components/PageList/PageList"
import PostsList from "@/components/PostList/PostsList"
import { useState, useEffect, useCallback } from "react"
import {
  PostResponse,
  PostSearchFilter,
  ProductCategory,
} from "@/utils/domain/label"
import { getPosts } from "@/utils/api/post/api"

export default function Page() {
  const pageSize = 12
  const [currentPage, setCurrentPage] = useState(0) // 0-based 페이지 번호
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchKeyword, setSearchKeyword] = useState("")
  const [productCategory, setProductCategory] =
    useState<ProductCategory | null>(null)
  const [region, setRegion] = useState<string | null>(null) // 사용안함
  const [postStatus, setPostStatus] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  // API 호출 함수
  const getPostsData = useCallback(
    async (page: number) => {
      setLoading(true)
      setError(null)
      try {
        const searchFilter: PostSearchFilter = {
          keyword: searchKeyword || undefined,
          productCategory: productCategory || undefined,
          postStatus: postStatus || undefined,
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
    [searchKeyword, productCategory, postStatus, minPrice, maxPrice, pageSize]
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    getPostsData(currentPage)
  }, [currentPage, getPostsData])

  useEffect(() => {
    setCurrentPage(0)
  }, [searchKeyword, productCategory, postStatus, minPrice, maxPrice])

  const onPageListHandle = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff8177]">
      <PostHeader />
      <div className="mx-auto w-full max-w-4xl flex flex-col">
        <PostsList posts={posts} loading={loading} error={error} />
        <PageList
          totalPages={totalPages}
          currentPage={currentPage}
          onPageListHandle={onPageListHandle}
        />
      </div>
    </div>
  )
}
