export type PostStatus = "SELLING" | "BOOKED" | "END"

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
  productCategory:
    | "DIGITAL_DEVICE"
    | "HOME_APPLIANCE"
    | "FURNITURE"
    | "KITCHEN"
    | "KIDS"
  createdAt: string
  updatedAt: string
  email: string
  userId: number
  nickname: string
}
