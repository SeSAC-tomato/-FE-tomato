export type PostStatus = "SELLING" | "BOOKED" | "END";

export type ProductCategory =
  | "DIGITAL_DEVICE"
  | "HOME_APPLIANCE"
  | "FURNITURE"
  | "KITCHEN"
  | "KIDS";

export const postStatusLabelMap: Record<PostStatus, string> = {
  SELLING: "판매중",
  BOOKED: "예약중",
  END: "거래완료",
};

export type PostResponse = {
  id: number;
  title: string;
  price: number;
  content: string;
  postStatus: PostStatus;
  productCategory: ProductCategory;
  imageUrl?: string;
  isLiked?: boolean;
  region?: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  userId: number;
  nickname: string;
};

export type PostPageResponseData = {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  posts: PostResponse[];
};

export type PostSearchFilter = {
  searchKeyword?: string;
  productCategory?: ProductCategory;
  selling?: boolean;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const categoryLabelMap: Record<string, ProductCategory> = {
  "디지털 기기": "DIGITAL_DEVICE",
  생활가전: "HOME_APPLIANCE",
  "가구/인테리어": "FURNITURE",
  "생활/주방": "KITCHEN",
  유아동: "KIDS",
} as const;

export const categoryMap = Object.fromEntries(
  Object.entries(categoryLabelMap).map(([label, value]) => [value, label])
) as Record<ProductCategory, string>;

export const categoryEnumToLabelMap: Record<ProductCategory, string> =
  Object.entries(categoryLabelMap).reduce((acc, [label, enumValue]) => {
    acc[enumValue] = label;
    return acc;
  }, {} as Record<ProductCategory, string>);

export type LikeResponse = {
  id: number;
  postId: number;
  userId: number;
  isLiked: boolean;
  createdAt: string;
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );
  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  return `${Math.floor(diffInMinutes / 1440)}일 전`;
}
