import { ProductCategory } from "@/utils/domain/label"

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
  totalPages: number
  setCurrentPage: (page: number) => void
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

export type PostHeadersProps = {
  searchKeyword?: string
  setSearchKeyword?: (v: string) => void
  productCategory?: ProductCategory | undefined
  setProductCategory?: (v: ProductCategory | undefined) => void
  selling?: boolean | undefined
  setSelling?: (v: boolean | undefined) => void
  minPrice?: string | undefined
  setMinPrice?: (v: string) => void
  maxPrice?: string | undefined
  setMaxPrice?: (v: string) => void
  region?: string
  setRegion?: (v: string) => void
}
