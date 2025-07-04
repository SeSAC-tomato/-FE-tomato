export type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export type LikeButtonProps = {
  isLiked: boolean
  fillColor?: string
  handleLike: () => void
}

export type PageListProps = {
  currentPage: number
  totalPage: number
  onPageListHandle: (page: number) => void
}

export type DropdownProps = {
  buttonText: string
  items: string[]
  onSelect: (item: string) => void
}

export type PostPageProps = {
  params: {
    id: string
  }
}

export type PostCreatePayload = {
  title: string
  productCategory: string
  price: number
  content: string
}

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
  userId: number
  userName: string
}
