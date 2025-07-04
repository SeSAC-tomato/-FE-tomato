"use client"
import PostHeader2 from "@/components/header/PostHeader2"
import { useState } from "react"
import { PostPageProps } from "@/utils/type"
import Image from "next/image"
import productImage from "../../../public/제품이미지.png"

export default function Post({ params }: PostPageProps) {
  const [postContent, setPostContent] = useState(`
    사용한지 2년 됐습니다. 
    케이스랑 펜슬, 키보드도 같이 드립니다. 
    본문의 내용이 아주 길어질수도 있을 경우에 대비하여 스크롤을
    구성한 대비의 화면입니다. 수정, 삭제 버튼은 고정 위치에 있으며
    전체 스크롤이 올라와도 언제나 하단에 고정되어 위치합니다.
    아래의 내용도 투명하게 보입니다.

    이것은 추가적인 내용입니다.
    엔터 키를 여러 번 눌러 줄 바꿈을 해보세요.
    그리고 띄어쓰기도 그대로 유지됩니다.
    
    텍스트가 길어지면 스크롤이 나타나게 됩니다.
    길이를 길게 표현합니다`)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null)

  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [resultMessage, setResultMessage] = useState("")

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

  return (
    <div>
      <div className="w-full h-screen flex-col min-h-screen">
        <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
          <PostHeader2 />
          <div className="flex flex-grow p-4 md:p-6 lg:p-8">
            <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
              <div className="text-sm text-gray900 mb-2 font-bold">
                <span>홈 &gt;&nbsp;</span>
                <span>제품 목록 &gt;&nbsp;</span>
                <span>아이패드 9세대 64GB</span>
              </div>
              <div className="w-4/5 h-auto m-5 rounded-lg overflow-hidden shadow-md">
                <Image
                  className="w-full h-full object-cover"
                  src={productImage}
                  alt="Product Image"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                아이패드 9세대 64GB
              </h1>
              <div className="flex justify-between items-center my-2">
                <p className="text-gray-600 text-1xl md:text-2xl">
                  디지털 기기
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-1xl md:text-2xl m-2">
                    끌올
                  </span>
                  <button className="bg-indigo-700 text-white py-2 px-5 m-2 text-sm lg:text-lg xl:text-xl rounded-2xl">
                    설정
                  </button>
                </div>
              </div>
              <div className="flex items-baseline mb-6">
                <span className="text-2xl md:text-3xl font-bold mr-2">
                  240,000 원
                </span>
                <span className="text-sm text-gray-500">2025-06-26 12:20</span>
              </div>
              <div className="flex space-x-4 mb-8 justify-between">
                <div className="flex justify-center items-center">
                  <button className="bg-gray-200 text-gray-900 py-2 px-4 text-sm lg:text-lg xl:text-xl rounded-2xl">
                    판매중
                  </button>
                  <button className="bg-indigo-700 text-white py-2 px-5 mx-2 text-sm lg:text-lg xl:text-xl rounded-2xl">
                    설정
                  </button>
                </div>
                <button className="bg-yellow-400 text-gray-900 py-2 px-10 text-sm lg:text-lg xl:text-xl rounded-2xl font-semibold">
                  채팅하기
                </button>
              </div>
              <div
                className="w-full p-2 border border-gray-100 rounded-md whitespace-pre-wrap overflow-y-auto 
              text-sm md:text-base lg:text-lm"
              >
                {postContent}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-[99]">
        <div className="bg-pink-500/10 p-4 shadow-lg flex items-center justify-end ">
          <div className="w-full max-w-lg flex space-x-4">
            <button
              onClick={() => openModal("edit")}
              className="flex-1 py-3 text-indigo-900 font-bold text-lg  rounded-md hover:bg-white/50 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => openModal("delete")}
              className="flex-1 py-3 text-indigo-900 font-bold text-lg  rounded-md hover:bg-white/50 transition-colors"
            >
              삭제
            </button>
            {modalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
                  <h2 className="text-xl font-bold mb-4">
                    {modalType === "edit"
                      ? "수정하시겠습니까?"
                      : "정말 삭제할까요?"}
                  </h2>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleConfirm}
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
                  <h2 className="text-lg font-medium mb-4">{resultMessage}</h2>
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
    </div>
  )
}
