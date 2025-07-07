"use client"

import React, { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { categoryLabelMap, ProductCategory } from "@/utils/domain/label"

// 폼 데이터의 타입 정의
interface PostFormData {
  title: string
  productCategory: ProductCategory | "" // 초기 빈 값 허용
  price: string
  content: string
  initialImageUrls?: string[] // 이미지를 초기화할 필요가 있다면 (수정 시)
  initialMainImageIndex?: number | null // 메인 이미지 인덱스를 초기화할 필요가 있다면 (수정 시)
}

// PostForm 컴포넌트의 props 타입 정의
interface PostFormProps {
  initialData?: PostFormData // 수정 모드일 때 초기 데이터 (선택 사항)
  onSubmit: (
    data: Omit<PostFormData, "initialImageUrls" | "initialMainImageIndex"> & {
      price: number // price는 number로 변환하여 전달
      imageUrls: string[] // 이미지 URL 목록 포함
      mainImageIndex: number | null // 메인 이미지 인덱스 포함
    }
  ) => void
  isEditing?: boolean // 수정 모드인지 여부 (버튼 텍스트 변경용)
}

const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const [form, setForm] = useState<PostFormData>(() => ({
    title: "",
    productCategory: "",
    price: "",
    content: "",
  }))
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)

  // 수정 모드일 때 초기 데이터를 폼 상태에 설정
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        productCategory: initialData.productCategory,
        price: initialData.price,
        content: initialData.content,
      })
      // 이미지 URL과 메인 이미지 인덱스도 초기 데이터에서 가져옵니다.
      setImageUrls(initialData.initialImageUrls || [])
      setMainImageIndex(initialData.initialMainImageIndex || null)
    } else {
      // 새로운 게시글 작성 시 상태 초기화 (혹시 모를 잔여 데이터 방지)
      setForm({
        title: "",
        productCategory: "",
        price: "",
        content: "",
      })
      setImageUrls([])
      setMainImageIndex(null)
    }
  }, [initialData]) // initialData가 변경될 때마다 실행

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const max = 5 - imageUrls.length
    const fileArray = Array.from(files).slice(0, max)

    // TODO: 실제 서버에 이미지 업로드 및 URL 받기 (비동기 처리)
    // 현재는 임시 URL을 사용하지만, 실제로는 여기에 API 호출 로직이 들어가야 합니다.
    const newImageUrls = fileArray.map((file) => URL.createObjectURL(file))

    setImageUrls((prev) => [...prev, ...newImageUrls])

    if (mainImageIndex === null && newImageUrls.length > 0) {
      setMainImageIndex(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 폼 데이터 유효성 검사 (클라이언트 측)
    if (!form.title || !form.productCategory || !form.price || !form.content) {
      alert("모든 필드를 입력해주세요.")
      return
    }
    if (isNaN(Number(form.price))) {
      alert("가격은 숫자로 입력해주세요.")
      return
    }
    if (imageUrls.length === 0) {
      alert("사진을 최소 한 장 등록해주세요.")
      return
    }

    const payload = {
      title: form.title,
      productCategory: form.productCategory,
      price: Number(form.price),
      content: form.content,
      imageUrls: imageUrls,
      mainImageIndex: mainImageIndex,
    }

    onSubmit(payload)
  }

  return (
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
                  checked={form.productCategory === categoryLabelMap[label]}
                  className="hidden"
                />
                {label}{" "}
                {/* 사용자에게 보이는 텍스트는 label (예: "디지털 기기") */}
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
        <label className="block font-semibold mb-2">사진 등록 (최대 5장)</label>
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

          {imageUrls.length < 5 && (
            <label
              htmlFor="image-upload-input"
              className="w-24 h-24 border rounded flex items-center justify-center bg-gray-100 text-gray-400 cursor-pointer"
            >
              <input
                type="file"
                id="image-upload-input"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Plus className="w-6 h-6" />
            </label>
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        className="w-full py-3 bg-green-800 text-white text-lg font-semibold rounded-lg hover:bg-green-900 transition-colors mt-8" // mt-8로 위쪽 여백 추가
      >
        {isEditing ? "수정 완료" : "저장"} {/* 버튼 텍스트 변경 */}
      </button>
    </form>
  )
}

export default PostForm
