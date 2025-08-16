"use client"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  categoryLabelMap,
  ImageCreatePayload,
  ImagePreview,
  ImageRegisterInfo,
  PostCreatePayload,
} from "@/utils/domain/label"
import { PostFormData } from "@/utils/domain/label"
import { PostFormProps } from "@/utils/type/post/type"
import { uploadBase64ImageAPI } from "@/utils/api/post/api"
import { fileToBase64 } from "@/utils/domain/file"

const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitFailure,
}) => {
  const [targetImages, setTargetImages] = useState<ImageRegisterInfo[]>([])
  const [imagePreview, setImagePreview] = useState<ImagePreview[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)
  const [form, setForm] = useState<PostFormData>(() => ({
    title: "",
    productCategory: "",
    price: "",
    content: "",
  }))
  type CategoryLabel = keyof typeof categoryLabelMap

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value })) //변경되는 값이 있으면 변경되는 항목에 값설정
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxSize = 5 - targetImages.length
    const fileArray = Array.from(files).slice(0, maxSize)

    const newImages: ImageRegisterInfo[] = fileArray.map((file) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file: file,
      savedName: undefined,
      originalName: file.name,
    }))
    setTargetImages((prev) => [...prev, ...newImages])

    const previews = newImages.map(({ id, url }) => ({ id, url }))
    setImagePreview((prev) => [...prev, ...previews])
    if (mainImageIndex === null && newImages.length > 0) {
      setMainImageIndex(0)
    }
    for (const newImage of newImages) {
      try {
        if (newImage.file) {
          const saved = await fileToBase64(newImage.file)
          const savedName = await uploadBase64ImageAPI(saved)
          setTargetImages((currentImage) =>
            currentImage.map((img) =>
              img.id === newImage.id ? { ...img, savedName: savedName } : img
            )
          )
          URL.revokeObjectURL(newImage.url)
        }
      } catch (error) {
        onSubmitFailure()
        setTargetImages((currentImages) =>
          currentImages.filter((img) => img.id !== newImage.id)
        )
        setImagePreview((currentPreviews) =>
          currentPreviews.filter((prev) => prev.id !== newImage.id)
        )
      }
    }
  }

  const handleImageDelete = (idToDelete: string) => {
    if (mainImageIndex) {
      const isMainImage = targetImages.some(
        (el, index) => el.id === idToDelete && index === mainImageIndex
      )
      const resetMainImage = targetImages.some(
        (el, index) => el.id === idToDelete && index < mainImageIndex
      )
    }
    setTargetImages((prevImage) =>
      prevImage.filter((el) => el.id !== idToDelete)
    )
    setImagePreview((image) => image.filter((el) => el.id != idToDelete))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.productCategory || !form.price || !form.content) {
      alert("모든 필드를 입력해주세요.")
      return
    }
    if (isNaN(Number(form.price))) {
      alert("가격은 숫자로 입력해주세요.")
      return
    }
    if (setTargetImages.length === 0) {
      alert("사진을 최소 한 장 등록해주세요.")
      return
    }
    try {
      const payload: PostCreatePayload = {
        title: form.title,
        productCategory: form.productCategory,
        price: Number(form.price),
        content: form.content,
        imageInfo: targetImages
          .filter((img) => img.savedName && img.originalName)
          .map<ImageCreatePayload>((info, idx) => ({
            savedName: info.savedName as string,
            originalName: info.originalName as string,
            mainImage: mainImageIndex === idx,
          })),
      }
      const response = await onSubmit(payload)
      onSubmitSuccess()
    } catch (error) {
      onSubmitFailure()
    }
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
                key={label}
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
        <label className="block font-semibold mb-2">사진 등록 (최대 5장)</label>
        <div className="flex gap-3 flex-wrap">
          <label htmlFor="chat-file-upload">업로드 +</label>
          <input
            type="file"
            id="chat-file-upload"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {imagePreview.map((el, idx) => (
            <div
              key={el.id}
              onClick={() => setMainImageIndex(idx)}
              className={`relative w-24 h-24 border rounded overflow-hidden cursor-pointer ${
                mainImageIndex === idx
                  ? "ring-4 ring-indigo-600"
                  : "border-gray-300"
              }`}
            >
              <img
                src={el.url}
                alt={`image-${idx}`}
                className="w-full h-full object-cover"
              />
              {mainImageIndex === idx && (
                <div className="absolute top-1 left-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">
                  대표
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleImageDelete(el.id)
                }}
                className="absolute top-1 right-1 bg-white text-gray-700 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-green-800 text-white text-lg font-semibold rounded-lg hover:bg-green-900 transition-colors mt-8" // mt-8로 위쪽 여백 추가
      >
        저장
      </button>
    </form>
  )
}

export default PostForm
