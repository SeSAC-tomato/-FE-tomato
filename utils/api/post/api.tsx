import { PostCreatePayload } from "@/utils/type/post/type"
import {
  PostPageResponseData,
  PostResponse,
  PostSearchFilter,
} from "@/utils/domain/label"
import api from "../axios"
import { CommonResponse } from "@/utils/type/common/type"

export const createOrUpdatePost = async (
  payload: PostCreatePayload
): Promise<PostResponse | null> => {
  const response = await api.post("/post", payload)
  console.log(response.data)
  alert("등록 완료")
  return response.data
}

export const getPostById = async (
  postId: Number | undefined
): Promise<PostResponse | null> => {
  const data = await api.get(`/post/${postId}`)
  const contents = data.data.data
  console.log(contents)
  return contents
}

export const getPosts = async (
  page: number,
  pageSize: number,
  filter?: PostSearchFilter
): Promise<CommonResponse<PostPageResponseData>> => {
  let endPoint = `post`
  let query = `?page=${page}&size=${pageSize}`
  const hasFilter =
    filter &&
    ((filter.searchKeyword !== undefined &&
      filter.searchKeyword !== null &&
      filter.searchKeyword !== "") ||
      (filter.productCategory !== undefined &&
        filter.productCategory !== null) ||
      (filter.selling !== undefined && filter.selling !== null) ||
      (filter.minPrice !== undefined && filter.minPrice !== null) ||
      (filter.maxPrice !== undefined && filter.maxPrice !== null))

  if (hasFilter) {
    endPoint = "post/search"

    if (filter.searchKeyword) {
      query += `&keyword=${encodeURIComponent(filter.searchKeyword)}`
    }
    if (filter.productCategory) {
      query += `&productCategory=${encodeURIComponent(filter.productCategory)}`
    }
    if (filter.selling) {
      query += `&selling=${encodeURIComponent(filter.selling)}`
    }
    if (filter.minPrice !== undefined && filter.minPrice !== null) {
      query += `&minPrice=${encodeURIComponent(filter.minPrice)}`
    }
    if (filter.maxPrice !== undefined && filter.maxPrice !== null) {
      query += `&maxPrice=${encodeURIComponent(filter.maxPrice)}`
    }
  }

  console.log(`${endPoint}${query}`)
  const response = await api.get<CommonResponse<PostPageResponseData>>(
    `${endPoint}?${query}`
  )
  console.log(response)
  return response.data
}
