"use client"
import MainHeader from "@/components/header/MainHeader"
import { useActionState, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  BASE_URL,
  categoryMap,
  ImageDisplayInfo,
  PostResponse,
  PostStatus,
  postStatusLabelMap,
} from "@/utils/domain/label"
import {
  changeStatus,
  deletePost,
  getPostById,
  setFavorite,
} from "@/utils/api/post/api"
import LikeButton from "@/components/button/LikeButton"
import PostStatusChangeButton from "@/components/button/PostStatusChangeButton"
import PostPullButton from "@/components/button/PostPullButton"
import { axiosGet } from "@/utils/api/chat/chatApi"
import {
  ChatCommonResponse,
  ChatPostResponse,
  ChatPostStatus,
  ChatProductCategory,
  ChatRoomRequest,
  ChatRoomResponse,
} from "@/utils/type/chat/chat"
import ChatModal from "@/components/chat/ChatModal"
import { useAuthStore } from "@/store/useAuthStore"
import Carousel from "@/components/post/Carousel"

export default function Post() {
  const testuser = useAuthStore((state) => state.testUser)
  const router = useRouter()
  const params = useParams()
  const postId = typeof params?.id === "string" ? Number(params.id) : undefined
  const [post, setPost] = useState<PostResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCurrentLiked, setIsCurrentLiked] = useState<boolean | undefined>(
    false
  )
  const [postStatusChange, setPostStatusChange] =
    useState<PostStatus>("SELLING")

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null)

  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const writer: boolean = testuser?.userId == post?.userId

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
        console.log("응답" + response)
        if (response) {
          setPost(response)
          setPostStatusChange(response.postStatus)
          setIsCurrentLiked(response.isLiked)
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
    if (!writer) return
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

  const handleLike = async () => {
    try {
      const response = await setFavorite(postId)
      console.log("-----Set------", response)
      if (!response) return
      setIsCurrentLiked(response.isLiked)
    } catch (error) {
      console.log(error)
    }
  }

  const handleStatuschange = async () => {
    if (!writer) return
    console.log(postStatusChange)
    try {
      if (post?.postStatus === "END") {
        setPostStatusChange("END")
      } else {
        const updatedPost = (await changeStatus(postId)) as any
        console.log(updatedPost)
        if (updatedPost) {
          console.log("상태변경", updatedPost.data.postStatus)
          setPostStatusChange(updatedPost.data.postStatus)
        } else {
          console.warn("상태 변경에 실패했습니다")
        }
      }
    } catch (error) {
      console.error("상태 변경 중 오류 발생:", error)
    }
  }

  const handleEditOrDelete = async () => {
    if (!writer) return
    if (modalType === "edit") {
      if (postId) {
        router.push(`/posts/${postId}/edit`)
        return
      }
      return
    }

    if (modalType === "delete") {
      try {
        if (!postId) return
        await deletePost(postId)
        setResultMessage("삭제가 완료되었습니다.")
        router.push("/posts")
      } catch (error) {
        setResultMessage("삭제에 실패했습니다.")
      }
      closeModal()
      setResultModalOpen(true)
    }

    closeModal()
  }
  //// chat 관련

  // 테스트용
  const post2: ChatPostResponse = {
    id: 22,
    title: "아이패드 9세대 64GB",
    price: 240000,
    content:
      "사용한지 2년 됐습니다.\n케이스랑 펜슬, 키보드도 같이 드립니다.\n본문의 내용이 아주 길어질수도 있을 경우에 대비하여 스크롤을 구성한 대비의 화면입니다.",
    postStatus: ChatPostStatus.SELLING,
    productCategory: ChatProductCategory.KIDS,
    createdAt: "string",
    updatedAt: "string",
    userId: 2,
    nickname: "test1",
    images: ["cd5722b8-f544-4f59-b346-ff8b04c6a035.png"],
  }

  const [modalInfo, setModalInfo] = useState<{
    roomId: number
    targetUserId: number
    targetUserNickname: string
  }>()
  const openChatModal = async () => {
    const data = await axiosGet<
      ChatCommonResponse<ChatRoomResponse>,
      ChatRoomRequest
    >("/chat/room", { targetUserId: post?.userId ? post.userId : post2.userId })

    // userId 정보가 있어야함!

    const { roomId, targetUserId, targetUserNickname } = data.data

    setModalInfo({ roomId, targetUserId, targetUserNickname })
  }
  const closeChatModal = () => {
    setModalInfo(undefined)
  }

  // chat

  const handlePostPull = () => {}
  console.log(isCurrentLiked)
  return (
    <>
      {modalInfo && testuser && testuser.userId != modalInfo.targetUserId && (
        <ChatModal
          userId={modalInfo.targetUserId}
          onClose={closeChatModal}
          roomId={modalInfo.roomId}
          nickname={modalInfo.targetUserNickname}
          key={modalInfo.roomId}
        />
      )}

      <MainHeader>
        {/* 카드/내용 영역만 스크롤, 전체는 overflow-hidden */}
        <div className="fixed inset-0 pt-[80px] overflow-y-auto hide-scrollbar flex flex-col items-center justify-center min-h-screen">
          {/* 네비게이션 뎁스(Breadcrumbs) - 카드 외부(카드 위, 배경 위) */}
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl px-12 py-10 flex flex-col gap-8">
            {/* 상단: 사진+설명 */}
            <div className="flex flex-row gap-10 w-full">
              <div className="flex-1 flex flex-col">
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
                {/* 사진 */}
                <div className="flex-1 flex flex-col items-center justify-start">
                  {post && postId && <Carousel post={post} postId={postId} />}
                  <div className="flex flex-row items-center justify-between gap-6 mt-4 w-full">
                    {/* 사용자 정보 */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                        <img
                          src={`https://picsum.photos/seed/item${postId}/400/400`}
                          alt="프로필"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          {post?.nickname}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {post?.region ?? "구로동"}
                        </div>
                      </div>
                      <LikeButton
                        isCurrentLiked={isCurrentLiked}
                        handleLike={handleLike}
                      />
                    </div>
                    {/* 버튼 그룹 (오른쪽 하단, 같은 라인) */}
                  </div>
                </div>
              </div>
              {/* 설명+정보 */}
              <div className="flex-1 flex flex-col justify-start">
                {/* 설명 위 정보 */}
                <div className="w-full max-w-md mx-auto mb-4">
                  <h2 className="text-2xl my-3 font-bold mr-2 flex items-center gap-2">
                    {post?.title}
                  </h2>
                  <div className="flex justify-between mr-10">
                    <div className="text-gray-700 text-lg">
                      {post?.productCategory &&
                        categoryMap[post.productCategory]}
                    </div>
                    {writer && (
                      <div className="flex justify-between items-center">
                        <div className="text-gray-700 text-lg mx-2">끌올</div>
                        <PostPullButton onClick={handlePostPull} />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mr-10 mt-3">
                    <div className="text-xl font-bold ">{post?.price} 원</div>
                    <div className="text-gray-500 text-base ">
                      게시일 : {post?.updatedAt?.slice(0, 16).replace("T", " ")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-3">
                  <div className="flex justify-between items-center">
                    {post?.postStatus && (
                      <div className="flex flex-row gap-2">
                        <div className="flex items-center rounded-full text-xl font-semibold">
                          {postStatusLabelMap[postStatusChange]}
                        </div>
                        {writer && (
                          <PostStatusChangeButton
                            postStatusChange={postStatusChange}
                            handleStatuschange={handleStatuschange}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {testuser && testuser.userId != post?.userId && (
                    <div className="flex gap-4 justify-end mr-10">
                      <button
                        onClick={openChatModal}
                        className="px-6 py-3 rounded-2xl bg-[#ffe066] text-[#222] font-bold text-base shadow hover:bg-[#ffd600] transition"
                      >
                        채팅하기
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md h-90 bg-gray-200 rounded-xl p-5 text-gray-700 text-base whitespace-pre-line overflow-y-auto mx-auto hide-scrollbar">
                  {post?.content}
                </div>
              </div>
            </div>
            {writer && (
              <div className="fixed bottom-0 left-0 w-full z-[99]">
                <div className="bg-orange-500/20 p-1 shadow-lg flex items-center justify-end ">
                  <div className="w-full max-w-lg flex space-x-4">
                    <button
                      onClick={() => openModal("edit")}
                      className="flex-1 py-3 text-indigo-900 font-bold text-2xl  rounded-md hover:hover:text-3xl transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => openModal("delete")}
                      className="flex-1 py-3 text-indigo-900 font-bold text-2xl  rounded-md hover:text-3xl transition-colors"
                    >
                      삭제
                    </button>
                    {modalOpen && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
                          <h2 className="text-xl font-bold mb-4">
                            {modalType === "edit"
                              ? "수정하시겠습니까?"
                              : "정말로 삭제하시겠습니까?"}
                          </h2>
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={closeModal}
                              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                              취소
                            </button>
                            <button
                              onClick={handleEditOrDelete}
                              className="px-4 py-2 bg-[#223029] text-white rounded hover:bg-[rgba(123,130,105,1)]"
                            >
                              확인
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {resultModalOpen && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110]">
                        <div className="bg-white rounded-lg p-5 w-[90%] max-w-sm shadow-xl text-center">
                          <h2 className="text-lg font-medium mb-4">
                            {resultMessage}
                          </h2>
                          <button
                            onClick={closeResultModal}
                            className="mt-2 px-5 py-2 bg-[#223029] text-white rounded hover:bg-[rgba(123,130,105,1)] transition-colors"
                          >
                            닫기
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainHeader>
    </>
  )
}
