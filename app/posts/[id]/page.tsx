"use client"
import MainHeader from "@/components/header/MainHeader"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import productImage from "../../../public/제품이미지.png"
import { useParams } from "next/navigation"
import { PostResponse, PostStatus } from "@/utils/type/post/type"
import { getPostById } from "@/utils/api/post/api"
import LikeButton from "@/components/button/LikeButton"

export default function Post() {
  const params = useParams()
  const postId = typeof params?.id === "string" ? Number(params.id) : undefined
  const [post, setPost] = useState<PostResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null)

  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [resultMessage, setResultMessage] = useState("")

  //기본상태설정
  const [title, setTitle] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [content, setContent] = useState<string>("")
  const [postStatus, setPostStatus] = useState<PostStatus>("SELLING") // 기본값은 "SELLING" 같은 enum 값 중 하나
  const [productCategory, setProductCategory] = useState<string>("")
  const [updatedAt, setUpdatedAt] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [nickname, setNickname] = useState<string>("")

  // 카드 너비에 맞춰 버튼바 중앙정렬
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState<number | null>(null)

  useEffect(() => {
    function updateWidth() {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  useEffect(() => {
    const getPost = async () => {
      if (!postId) {
        console.warn("postId가 없습니다. 요청을 수행할 수 없습니다.")
        return null
      }
      try {
        const response = await getPostById(postId)
        if (response) {
          setPost(response)
          setTitle(response.title)
          setPrice(Number(response.price)) // 혹시 문자열일 경우 대비해서 Number로 변환
          setContent(response.content)
          setPostStatus(response.postStatus)
          setProductCategory(response.productCategory)
          setUpdatedAt(response.updatedAt)
          setNickname(response.nickname)
          console.log(response)
        } else {
          setError("게시물을 찾을 수 없습니다.")
        }
      } catch (error) {
        console.error("게시물 로딩 중 오류 발생:", error)
        setError("게시물을 불러오는 데 실패했습니다.")
      }
    }
    getPost()
  }, [postId])

  const openModal = (type: "edit" | "delete") => {
    setModalType(type)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalType(null)
  }

  const handleConfirm = () => {
    // 실제 수정/삭제 처리
    if (modalType === "edit") {
      setResultMessage("수정이 완료되었습니다.")
    } else if (modalType === "delete") {
      setResultMessage("삭제가 완료되었습니다.")
    }

    closeModal()
    setResultModalOpen(true)
  }

  const closeResultModal = () => {
    setResultModalOpen(false)
  }

  const handleLike = () => {
    setIsLiked((prev) => !prev)
  }

  return (
    <>
      <MainHeader>
        {/* 카드/내용 영역만 스크롤, 전체는 overflow-hidden */}
        <div className="fixed inset-0 pt-[80px] overflow-y-auto hide-scrollbar flex flex-col items-center justify-center min-h-screen">
          {/* 네비게이션 뎁스(Breadcrumbs) - 카드 외부(카드 위, 배경 위) */}
          <div className="w-full max-w-5xl flex justify-start mb-6 text-sm text-gray-500 items-center gap-0 pl-0">
            <Link
              href="/"
              className="hover:underline hover:text-[#e53935] transition"
            >
              홈
            </Link>
            <span className="px-1">&gt;</span>
            <Link
              href="/posts"
              className="hover:underline hover:text-[#e53935] transition"
            >
              중고거래
            </Link>
            <span className="px-1">&gt;</span>
            <Link
              href={`/posts?category=${post?.productCategory}`}
              className="hover:underline hover:text-[#e53935] transition"
            >
              {post?.productCategory}
            </Link>
            <span className="px-1">&gt;</span>
            <span className="text-gray-800 font-bold">{post?.title}</span>
          </div>
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl px-12 py-10 flex flex-col gap-8">
            {/* 상단: 사진+설명 */}
            <div className="flex flex-row gap-10 w-full">
              {/* 사진 */}
              <div className="flex-1 flex flex-col items-center justify-start">
                <div className="w-full max-w-md bg-gray-300 rounded-xl flex items-center justify-center h-full">
                  <Image
                    src={productImage}
                    alt="제품 이미지"
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
                <div className="flex flex-row items-center justify-between gap-6 mt-4 w-full">
                  {/* 사용자 정보 */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                      <Image
                        src="https://via.placeholder.com/48x48.png?text=U"
                        alt="프로필"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {nickname},{email}
                      </div>
                      <div className="text-gray-500 text-sm">구로동</div>
                    </div>
                    <LikeButton isLiked={isLiked} handleLike={handleLike} />
                  </div>
                  {/* 버튼 그룹 (오른쪽 하단, 같은 라인) */}
                </div>
              </div>
              {/* 설명+정보 */}
              <div className="flex-1 flex flex-col justify-start">
                {/* 설명 위 정보 */}
                <div className="w-full max-w-md mx-auto mb-4">
                  <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    {post?.title} A
                    {post?.postStatus === "BOOKED" && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        예약
                      </span>
                    )}
                    {post?.postStatus === "SELLING" && (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                        판매중
                      </span>
                    )}
                    {post?.postStatus === "END" && (
                      <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                        판매완료
                      </span>
                    )}
                  </h2>
                  <div className="text-gray-500 text-base mb-1">
                    {productCategory} · {updatedAt}
                  </div>
                  <div className="text-xl font-bold mb-4">{price}</div>
                </div>
                <div
                  className="w-full p-2 border border-gray-100 rounded-md whitespace-pre-wrap overflow-y-auto
              text-sm md:text-base lg:text-lm"
                ></div>
                <div className="flex gap-4 justify-end">
                  <button className="px-6 py-2 rounded-full bg-[#ffe066] text-[#222] font-bold text-base shadow hover:bg-[#ffd600] transition">
                    채팅
                  </button>
                </div>
                {/* 설명 박스 (사진과 같은 크기, 내부 스크롤) */}
                <div className="w-full max-w-md h-90 bg-gray-200 rounded-xl p-5 text-gray-700 text-base whitespace-pre-line overflow-y-auto mx-auto hide-scrollbar">
                  {content}
                </div>
              </div>
            </div>
            {/* 하단: 사용자+버튼 */}
          </div>
        </div>
      </MainHeader>
    </>
  )
}
