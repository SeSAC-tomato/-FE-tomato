import {
  FormSubmitData,
  PostFormData,
  PostResponse,
  ProductCategory,
} from "@/utils/domain/label"

export type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export interface LikeButtonProps {
  isCurrentLiked: boolean | undefined
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
  dongs: string[]
}

export type CarouselProps = {
  postId: number
  post: PostResponse
}

export type PostFormProps = {
  postId: number
  onSubmit: (data: FormSubmitData) => Promise<PostResponse | null>
  isEditing?: boolean // 수정 모드인지 여부 (버튼 텍스트 변경용)
}
