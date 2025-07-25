"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CheckModal from "@/components/modals/CheckModal"
import PostForm from "@/components/post/PostForm"
import { createPost } from "@/utils/api/post/api"
import MainHeader from "@/components/header/MainHeader"
//비로그인 접근 주의
export default function NewProduct() {
  const router = useRouter()
  // const [imageUrls, setImageUrls] = useState<string[]>([])
  // const [imageInfo, setImageInfo] = useState<ImageInfo[]>([])
  // const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("") // string 타입 유지
  const [modalCanUse, setModalCanUse] = useState(false) // '사용' 버튼 활성화 여부
  const [modalOnUseAction, setModalOnUseAction] = useState<(() => void) | null>(
    null
  )
  const handleModalClose = () => {
    setModalOpen(false)
  }

  return (
    <div>
      <div className="w-full h-screen flex-col min-h-screen">
        <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
          <MainHeader />
          <div className="max-w-2xl mx-auto px-4 py-8">
            <PostForm
              onSubmit={createPost}
              onSubmitSuccess={() => {
                setModalMessage(
                  "게시글이 성공적으로 등록되었습니다!\n메인 화면으로 이동하시겠습니까?"
                )
                setModalCanUse(true)
                setModalOnUseAction(() => () => {
                  setModalOpen(false)
                  router.push(`/posts`)
                })
                setModalOpen(true) // 모달 열기
              }}
              onSubmitFailure={() => {
                setModalMessage(
                  "게시글 전송에 실패했습니다. 다시 시도해주세요."
                )
                setModalCanUse(false)
                setModalOnUseAction(null)
                setModalOpen(true)
              }}
            />
          </div>
        </div>
      </div>
      <CheckModal
        open={modalOpen}
        message={modalMessage}
        canUse={modalCanUse}
        onUse={modalOnUseAction || handleModalClose}
        onClose={handleModalClose}
      />
    </div>
  )
}
