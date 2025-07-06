"use client"

import PostHeader2 from "@/components/header/PostHeader2"
import { useState } from "react"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { createOrUpdatePost } from "@/utils/api/post/api"

export default function newProduct() {
  //   const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([]) // 이미지 URL만 관리
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)

  const [form, setForm] = useState({
    title: "",
    productCategory: "",
    price: "",
    content: "",
  })

  const categoryMap = {
    "디지털 기기": "DIGITAL_DEVICE",
    생활가전: "HOME_APPLIANCE",
    "가구/인테리어": "FURNITURE",
    "생활/주방": "KITCHEN",
    유아동: "KIDS",
  } as const
  type CategoryLabel = keyof typeof categoryMap
  type CategoryValue = (typeof categoryMap)[CategoryLabel]

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

  const handleImageSelect = () => {
    // 실제 업로드는 나중에 구현
    const dummyUrl = `/placeholder-${imageUrls.length + 1}.png`
    if (imageUrls.length >= 5) return alert("최대 5장까지 등록 가능합니다.")
    setImageUrls([...imageUrls, dummyUrl])
    if (mainImageIndex === null) setMainImageIndex(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(payload)
      const response = await createOrUpdatePost(payload)
    } catch (error) {
      console.error("전송 실패", error)
      alert("전송실패")
    }
  }

  return (
    <div>
      <div className="w-full h-screen flex-col min-h-screen">
        <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
          <PostHeader2 />
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
                  {(Object.keys(categoryMap) as CategoryLabel[]).map(
                    (label: CategoryLabel) => (
                      <label
                        key={uuidv4()}
                        className={`px-3 py-1.5 rounded-full text-sm border cursor-pointer ${
                          form.productCategory === categoryMap[label]
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="productCategory"
                          value={categoryMap[label]}
                          onChange={handleInput}
                          checked={form.productCategory === categoryMap[label]}
                          className="hidden"
                        />
                        {categoryMap[label]}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* 가격 */}
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

              {/* 내용 */}
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

              {/* 이미지 등록 + 대표 설정 */}
              <div>
                <label className="block font-semibold mb-2">
                  사진 등록 (최대 5장)
                </label>
                <div className="flex gap-3 flex-wrap">
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

                  <label htmlFor="chat-file-upload">업로드</label>
                  <input
                    type="file"
                    id="chat-file-upload"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    style={{ display: "none" }}
                    // onChange={handleFileChange}
                  />

                  {/* 이미지 추가 버튼 */}
                  {imageUrls.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById("chat-file-upload")?.click()
                      }}
                      className="w-24 h-24 border rounded flex items-center justify-center bg-gray-100 text-gray-400"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* 저장 버튼 */}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-900 text-white text-lg font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
              >
                저장
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
