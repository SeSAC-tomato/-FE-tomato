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
