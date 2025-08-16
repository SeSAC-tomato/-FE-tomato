"use client"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { updatePost } from "@/utils/api/post/api"
import MainHeader from "@/components/header/MainHeader"
import { useParams, useRouter } from "next/navigation"
import CheckModal from "@/components/modals/CheckModal"
import { useAuthStore } from "@/store/useAuthStore"
import PatchForm from "@/components/post/PatchForm"

export default function UpdateProduct() {
  const router = useRouter()
  const params = useParams()
  const postId = typeof params?.id === "string" ? Number(params.id) : undefined
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("") // string 타입 유지
  const [modalCanUse, setModalCanUse] = useState(false) // '사용' 버튼 활성화 여부
  const [modalOnUseAction, setModalOnUseAction] = useState<(() => void) | null>(
    null
  )
  const handleModalClose = () => {
    setModalOpen(false) // 모달 닫기
  }

  return (
    <>
      {isLoggedIn && postId && (
        <div>
          <div className="w-full h-screen flex-col min-h-screen">
            <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
              <MainHeader />
              <div className="max-w-2xl mx-auto px-4 py-8">
                <PatchForm
                  postId={postId}
                  onSubmit={updatePost}
                  onSubmitSuccess={() => {
                    setModalMessage(
                      "게시글이 성공적으로 등록되었습니다!\n메인 화면으로 이동하시겠습니까?"
                    )
                    setModalCanUse(true)
                    setModalOnUseAction(() => () => {
                      setModalOpen(false)
                      router.push(`/posts`)
                    })
                    setModalOpen(true)
                  }}
                  onSubmitFailure={() => {
                    setModalMessage("등록에 실패했습니다. 다시 시도해주세요.")
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
            onUse={modalOnUseAction || handleModalClose} // '사용' 버튼 클릭 시 실행할 액션
            onClose={handleModalClose} // '닫기' 버튼 클릭 시 실행할 액션
          />
        </div>
      )}
    </>
  )
}
