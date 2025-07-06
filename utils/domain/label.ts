export type PostStatus = "SELLING" | "BOOKED" | "END"

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
  imageUrl?: string
  isLiked?: boolean
  region?: string
  createdAt: string
  updatedAt: string
  email: string
  userId: number
  nickname: string
}

export type PostPageResponseData = {
  page: number
  size: number
  totalCount: number
  totalPages: number
  posts: PostResponse[]
}

export type PostSearchFilter = {
  keyword?: string
  productCategory?: ProductCategory
  postStatus?: boolean
  minPrice?: number
  maxPrice?: number
}
