export type PostStatus = "SELLING" | "BOOKED" | "END"
export const BASE_URL = "http://localhost:8080"
export type ProductCategory =
  | "DIGITAL_DEVICE"
  | "HOME_APPLIANCE"
  | "FURNITURE"
  | "KITCHEN"
  | "KIDS"

export const postStatusLabelMap: Record<PostStatus, string> = {
  SELLING: "판매중",
  BOOKED: "예약중",
  END: "거래완료",
}

export type PostResponse = {
  id: number
  title: string
  price: number
  content: string
  postStatus: PostStatus
  productCategory: ProductCategory
  images?: NewImageDisplayInfo[]
  isLiked?: boolean
  region: string
  createdAt: string
  updatedAt: string
  email: string
  userId: number
  nickname: string
}

export type PostResponseWithImage = {
  id: number
  title: string
  price: number
  content: string
  postStatus: PostStatus
  productCategory: ProductCategory
  mainImage: NewImageDisplayInfo
  isLiked: boolean
  region: string
  createdAt: string
  updatedAt: string
  email: string
  userId: number
  nickname: string
  numberOfLikes: number
}

export type ImageDisplayInfo = {
  id?: number
  savedName: string
  origialnalName?: string
  mainImage: boolean
  url: string
}

export type NewImageDisplayInfo = {
  id: number
  savedName: string
  mainImage?: boolean
}

export type PostPageResponseData = {
  page: number
  size: number
  totalCount: number
  totalPages: number
  posts: PostResponseWithImage[]
}

export type PostSearchFilter = {
  searchKeyword?: string
  productCategory?: ProductCategory
  selling?: boolean
  region?: string
  minPrice?: number
  maxPrice?: number
}

export const categoryLabelMap: Record<string, ProductCategory> = {
  "디지털 기기": "DIGITAL_DEVICE",
  생활가전: "HOME_APPLIANCE",
  "가구/인테리어": "FURNITURE",
  "생활/주방": "KITCHEN",
  유아동: "KIDS",
} as const

export const categoryMap = Object.fromEntries(
  Object.entries(categoryLabelMap).map(([label, value]) => [value, label])
) as Record<ProductCategory, string>

export const categoryEnumToLabelMap: Record<ProductCategory, string> =
  Object.entries(categoryLabelMap).reduce((acc, [label, enumValue]) => {
    acc[enumValue] = label
    return acc
  }, {} as Record<ProductCategory, string>)

export type LikeResponse = {
  id: number
  postId: number
  userId: number
  isLiked: boolean
  createdAt: string
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  )
  if (diffInMinutes < 1) return "방금 전"
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
  return `${Math.floor(diffInMinutes / 1440)}일 전`
}

export type PostCreatePayload = {
  title: string
  productCategory: string
  price: number
  content: string
  imageInfo: ImageCreatePayload[]
}

// 이미지를 생성하기 위해 보내는 payload, 백엔드 DTO의 Boolean mainImage에 맞춤
export type ImageCreatePayload = {
  savedName: string
  originalName: string
  mainImage: boolean
}

//서버에 저장된 파일명, 사용자가 업로드한 원본 파일명, (프론트에서 관리)
export type ImageInfo = {
  savedName: string
  originalName: string
}

export type PostFormData = {
  title: string
  productCategory: ProductCategory | ""
  price: string
  content: string
  images?: string[]
  mainImageIndex?: number | null
}

export type FormSubmitData = {
  title: string
  productCategory: ProductCategory
  price: number
  content: string
  images?: string[]
  mainImageIndex?: number | null
}
