"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { createOrUpdatePost, uploadBase64ImageAPI } from "@/utils/api/post/api"
import MainHeader from "@/components/header/MainHeader"
import { categoryLabelMap, ImageInfo } from "@/utils/domain/label"
import { useRouter } from "next/navigation"
import CheckModal from "@/components/modals/CheckModal"
import { fileToBase64 } from "@/utils/domain/file"

export default function NewProduct() {
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageInfo, setImageInfo] = useState<ImageInfo[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("") // string 타입 유지
  const [modalCanUse, setModalCanUse] = useState(false) // '사용' 버튼 활성화 여부
  const [modalOnUseAction, setModalOnUseAction] = useState<(() => void) | null>(
    null
  ) // '사용' 버튼 클릭 시 실행될 함수
  const [form, setForm] = useState({
    title: "",
    productCategory: "",
    price: "",
    content: "",
  })

  type CategoryLabel = keyof typeof categoryLabelMap
  type CategoryValue = (typeof categoryLabelMap)[CategoryLabel]

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const payload = {
    title: form.title,
    productCategory: form.productCategory,
    price: Number(form.price),
    content: form.content,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const completedPayload = {
        title: form.title,
        productCategory: form.productCategory,
        price: Number(form.price),
        content: form.content,
        imageInfo: imageInfo.map((info, idx) => ({
          savedName: info.savedName,
          originalName: info.originalName,
          mainImage: mainImageIndex === idx,
        })),
      }
      console.log("전송페이로드", completedPayload)
      const response = await createOrUpdatePost(completedPayload)
      setModalMessage(
        "게시글이 성공적으로 등록되었습니다!\n메인 화면으로 이동하시겠습니까?"
      )
      setModalCanUse(true)
      setModalOnUseAction(() => () => {
        setModalOpen(false)
        router.push(`/posts`)
      })
      setModalOpen(true) // 모달 열기
    } catch (error) {
      console.error("전송 실패", error)
      alert("전송실패")
      console.error("전송 실패", error)
      // alert("전송실패") // ★★★ 이 alert는 모달과 중복되므로 제거 ★★★
      // --- 실패 시 모달 띄우기 ---
      setModalMessage("게시글 전송에 실패했습니다. 다시 시도해주세요.")
      setModalCanUse(false)
      setModalOnUseAction(null)
      setModalOpen(true)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxSize = 5 - imageInfo.length
    const fileArray = Array.from(files).slice(0, maxSize)

    const newImageUrls = fileArray.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...newImageUrls])

    if (mainImageIndex === null) setMainImageIndex(0)

    for (const file of fileArray) {
      try {
        const saved = await fileToBase64(file)
        const savedName = await uploadBase64ImageAPI(saved)
        console.log(savedName)
        setImageInfo((prev) => [
          ...prev,
          { savedName: savedName, originalName: file.name },
        ])
        if (mainImageIndex == null) setMainImageIndex(0)
      } catch (error) {
        console.error("파일 업로드 실패:", error)
        alert("이미지 업드로 실패")
      }
    }
  }

  return (
    <div>
      <div className="w-full h-screen flex-col min-h-screen">
        <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
          <MainHeader />
          <div className="max-w-2xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="w-24 font-semibold">제목</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  className="flex-1 border rounded px-4 py-2 bg-gray-50"
                  placeholder="예) 아이패드 9세대 64GB"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-24 font-semibold">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(categoryLabelMap) as CategoryLabel[]).map(
                    (label: CategoryLabel) => (
                      <label
                        key={uuidv4()}
                        className={`px-3 py-1.5 rounded-full text-sm border cursor-pointer ${
                          form.productCategory === categoryLabelMap[label]
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="productCategory"
                          value={categoryLabelMap[label]}
                          onChange={handleInput}
                          checked={
                            form.productCategory === categoryLabelMap[label]
                          }
                          className="hidden"
                        />
                        {label}{" "}
                      </label>
                    )
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 font-semibold">가격</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInput}
                    className="flex-1 border rounded px-4 py-2 bg-gray-50"
                    required
                  />
                  <span className="text-sm">원</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-24 font-semibold">내용</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleInput}
                  rows={6}
                  className="flex-1 border rounded px-4 py-2 bg-gray-50 overflow-y-auto resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  사진 등록 (최대 5장)
                </label>
                <div className="flex gap-3 flex-wrap">
                  <label htmlFor="chat-file-upload">업로드 +</label>
                  {/* 사진 인풋 */}
                  <input
                    type="file"
                    id="chat-file-upload"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMainImageIndex(idx)}
                      className={`relative w-24 h-24 border rounded overflow-hidden cursor-pointer ${
                        mainImageIndex === idx
                          ? "ring-4 ring-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`image-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      {mainImageIndex === idx && (
                        <div className="absolute top-1 left-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">
                          대표
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full my-3 py-3 bg-green-800 text-white text-lg font-semibold rounded-lg hover:bg-green-900 transition-colors"
              >
                저장
              </button>
            </form>
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
