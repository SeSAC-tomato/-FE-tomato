"use client"
import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  BASE_URL,
  categoryLabelMap,
  ImageCreatePayload,
  ImageDisplayInfoMixed,
  ImagePreview,
  ImageRegisterInfo,
  PostCreatePayload,
} from "@/utils/domain/label"
import { PostFormData } from "@/utils/domain/label"
import { PatchFormProps } from "@/utils/type/post/type"
import { getPostById, uploadBase64ImageAPI } from "@/utils/api/post/api"
import { fileToBase64 } from "@/utils/domain/file"

const PatchForm: React.FC<PatchFormProps> = ({
  postId,
  onSubmit,
  onSubmitSuccess,
  onSubmitFailure,
}) => {
  const [loadedImages, setLoadedImages] = useState<ImageDisplayInfoMixed[]>([]) //기존 이미지
  const [payloadImages, setPayLoadImages] = useState<ImageRegisterInfo[]>([]) //전체 이미지
  const [imagePreview, setImagePreview] = useState<ImagePreview[]>([]) //프리뷰이미지
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null) //메인 이미지
  const [form, setForm] = useState<PostFormData>(() => ({
    title: "",
    productCategory: "",
    price: "",
    content: "",
  }))
  type CategoryLabel = keyof typeof categoryLabelMap

  useEffect(() => {
    const getPost = async () => {
      try {
        //기존 설정값 받아오기
        const response = await getPostById(postId)
        if (response) {
          setForm({
            title: response.title,
            productCategory: response.productCategory,
            price: String(response.price),
            content: response.content,
          }) //기존 이미지가 있다면 form에 표시
          if (response.images && response.images.length > 0) {
            const loadedImages: ImageDisplayInfoMixed[] = response.images.map(
              (img) => ({
                id: String(img.id),
                url: `${BASE_URL}/api/v1/post/images/${img.savedName}`, //사진 렌더링경로
                originalName: img.originalName,
                savedName: img.savedName,
              })
            )
            const mainImageIndex = response.images.findIndex(
              //main이미지에 mainImage true
              (img) => img.mainImage === true
            )
            setLoadedImages(loadedImages)
            setPayLoadImages(loadedImages)
            setImagePreview(loadedImages)
            setMainImageIndex(mainImageIndex)
          }
        }
      } catch (error) {
        console.error("게시글 초기 수신 실패", error)
        throw error
      }
    }
    getPost()
  }, []) //조건이 바뀔때마다 다시 렌더링

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const remainSlot = 5 - payloadImages.length //현재 images상태에 저장된 파일에서 여분갯수만큼만 추가가능
    if (remainSlot <= 0) {
      alert("이미지는 최대 5장까지만 등록할수 있습니다")
      return
    }
    const fileArray = Array.from(files).slice(0, remainSlot)
    const newImages: ImageRegisterInfo[] = fileArray.map((file) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file: file,
      savedName: undefined,
      originalName: file.name,
    }))
    setPayLoadImages((prev) => [...prev, ...newImages])

    const previews = newImages.map(({ id, url }) => ({ id, url }))
    setImagePreview((prevImages) => [...prevImages, ...previews]) //이미지를 상태에 추가하되 mainImage가 없다면 0번에
    if (mainImageIndex === null && newImages.length > 0) {
      setMainImageIndex(0)
    }
    for (const newImage of newImages) {
      try {
        if (newImage.file) {
          const saved = await fileToBase64(newImage.file!)
          const savedName = await uploadBase64ImageAPI(saved)
          console.log(`uploaded: ${savedName}`)
          setPayLoadImages((currentImage) =>
            currentImage.map((img) =>
              img.id === newImage.id ? { ...img, savedName: savedName } : img
            )
          )
          if (mainImageIndex === null && payloadImages.length > 0) {
            setMainImageIndex(0)
          }
          URL.revokeObjectURL(newImage.url)
        }
      } catch (error) {
        onSubmitFailure()
      }
    }
  }

  const handleImageDelete = (idToDelete: string) => {
    //mainImage삭제 혹은 이미지 삭제로 인해 메인 이미지 인덱스 변경
    let mainImageDelete , mainImageReset = false; 
    if (mainImageIndex) {
      mainImageDelete = payloadImages.some(
        (el, index) => el.id === idToDelete && index === mainImageIndex
      )
      mainImageReset = payloadImages.some(
        (el, index) => el.id === idToDelete && index < mainImageIndex
      )
    }

    const newImages = payloadImages.filter((el) => el.id !== idToDelete)
    setPayLoadImages((prevImage) =>
      newImages
    )
    setImagePreview((prevImage) =>
      newImages
    )
    if(mainImageDelete && newImages.length > 0) {
      setMainImageIndex(0)
    }else if(mainImageReset && newImages.length > 0){
      setMainImageIndex(prev => prev ? prev-1 : 0)
    }else if (newImages.length > 0 && mainImageIndex == null){
      setMainImageIndex(0)
    }

    console.log(newImages)
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
    if (payloadImages.length === 0) {
      alert("사진을 최소 한 장 등록해주세요.")
      return
    }
    if (mainImageIndex === null) {
      alert("메인이미지가 등록되어야 합니다.")
      return
    }

    try {
      const payload: PostCreatePayload = {
        title: form.title,
        productCategory: form.productCategory,
        price: Number(form.price),
        content: form.content,
        imageInfo: payloadImages
          .filter((img) => img.savedName && img.originalName)
          .map<ImageCreatePayload>((info, idx) => ({
            savedName: info.savedName as string,
            originalName: info.originalName as string,
            mainImage: mainImageIndex === idx,
          })),
      }
      const response = await onSubmit(Number(postId), payload)
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
          {/* 사진등록 */}
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
        수정
      </button>
    </form>
  )
}

export default PatchForm
