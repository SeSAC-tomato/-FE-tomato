// utils/type/mypage/type.ts
interface Post {
  id: number;
  title: string;
  price: number;
  img: string;
  createdAt: string;
  updatedAt: string;
  postStatus: string;
  productCategory: string;
}
interface CartPost {
  postId: number;
  title: string;
  price: number;
  img: string;
  createdAt: string;
  updatedAt: string;
  postStatus: string;
  productCategory: string;
}

interface PageMeta {
  currentPage: number;
  totalPages: number;
  size: number;
  totalElements: number;
}

interface PostsResponse {
  totalSellingPosts: number;
  totalEndPosts: number;
  sellingPosts: {
    content: Post[];
    pageMeta: PageMeta;
  };
  endPosts: {
    content: Post[];
    pageMeta: PageMeta;
  };
}

export type { Post, CartPost, PageMeta, PostsResponse };
