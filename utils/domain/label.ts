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
  images?: ImageDisplayInfo[]
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

export type ImageCreatePayload = {
  // PostCreatePayload와 혼동되지 않도록 이름 변경 제안
  savedName: string
  originalName: string
  mainImage: boolean // 백엔드 DTO의 Boolean mainImage에 맞춰 boolean 타입으로
}

export type PostCreatePayload = {
  title: string
  productCategory: string
  price: number
  content: string
  imageInfo: ImageCreatePayload[]
}

export type ImageInfo = {
  savedName: string // 서버에 저장된 파일명 (또는 URL)
  originalName: string // 사용자가 업로드한 파일의 원본 이름 (프론트에서 관리)
}
