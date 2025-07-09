"use client"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  createOrUpdatePost,
  getPostById,
  updatePost,
} from "@/utils/api/post/api"
import MainHeader from "@/components/header/MainHeader"
import { categoryLabelMap, PostStatus } from "@/utils/domain/label"
import { useParams, useRouter } from "next/navigation"
import CheckModal from "@/components/modals/CheckModal"
import { useAuthStore } from "@/store/useAuthStore"

export default function newProduct() {
  const router = useRouter()
  const params = useParams()
  //   const [imageUrls, setImageUrls] = useState<string[]>([])
  const postId = typeof params?.id === "string" ? Number(params.id) : undefined

  const [title, setTitle] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [content, setContent] = useState<string>("")
  const [productCategory, setProductCategory] = useState<string>("")

  const [imageUrls, setImageUrls] = useState<string[]>([]) // 이미지 URL만 관리
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("") // string 타입 유지
  const [modalCanUse, setModalCanUse] = useState(false) // '사용' 버튼 활성화 여부
  const [modalOnUseAction, setModalOnUseAction] = useState<(() => void) | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "",
    productCategory: "",
    price: "",
    content: "",
  })
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인 후 접근하실수 있습니다")
      router.push(`/posts`)
    }
    const getPost = async () => {
      if (!postId) {
        console.warn("postId가 없습니다. 요청을 수행할 수 없습니다.")
        return null
      }
      try {
        const response = await getPostById(postId)
        if (response) {
          setTitle(response.title)
          setPrice(Number(response.price)) // 혹시 문자열일 경우 대비해서 Number로 변환
          setContent(response.content)
          setProductCategory(response.productCategory)
          console.log(response)
          setForm({
            title: response.title,
            productCategory: response.productCategory,
            price: String(response.price),
            content: response.content,
          })
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

  type CategoryLabel = keyof typeof categoryLabelMap
  type CategoryValue = (typeof categoryLabelMap)[CategoryLabel]

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = () => {
    const dummyUrl = `/placeholder-${imageUrls.length + 1}.png`
    if (imageUrls.length >= 5) return alert("최대 5장까지 등록 가능합니다.")
    setImageUrls([...imageUrls, dummyUrl])
    if (mainImageIndex === null) setMainImageIndex(0)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!postId) {
      alert("postId가 없습니다.")
      return
    }

    const payload = {
      title: form.title,
      productCategory: form.productCategory,
      price: Number(form.price),
      content: form.content,
    }

    try {
      const response = await updatePost(postId, payload) // ← 여기도 수정 필요!
      setModalMessage(
        "게시글이 성공적으로 수정되었습니다!\n메인 화면으로 이동하시겠습니까?"
      )
      setModalCanUse(true)
      setModalOnUseAction(() => () => {
        setModalOpen(false)
        router.push(`/posts`)
      })
      setModalOpen(true)
    } catch (error) {
      console.error("전송 실패", error)
      setModalMessage("게시글 전송에 실패했습니다. 다시 시도해주세요.")
      setModalCanUse(false)
      setModalOnUseAction(null)
      setModalOpen(true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const max = 5 - imageUrls.length
    const fileArray = Array.from(files).slice(0, max)

    const newImageUrls = fileArray.map((file) => URL.createObjectURL(file))

    setImageUrls((prev) => [...prev, ...newImageUrls])

    if (mainImageIndex === null && newImageUrls.length > 0) {
      setMainImageIndex(0)
    }
  }
  const handleModalClose = () => {
    setModalOpen(false) // 모달 닫기
  }

  return (
    <div>
      {isLoggedIn && (
        <>
          <div className="w-full h-screen flex-col min-h-screen">
            <div className="mx-auto w-full lg:w-[1024px] flex flex-col">
              <MainHeader />
              <div className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleUpdate} className="space-y-6">
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
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* 저장 버튼 */}
                  <button
                    type="submit"
                    className="w-full my-3 py-3 bg-green-800 text-white text-lg font-semibold rounded-lg hover:bg-green-900 transition-colors"
                  >
                    수정
                  </button>
                </form>
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
        </>
      )}
    </div>
  )
}
