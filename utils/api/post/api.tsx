import {
  LikeResponse,
  PostCreatePayload,
  PostPageResponseData,
  PostResponse,
  PostSearchFilter,
} from "@/utils/domain/label"
import api from "../axios"
import { CommonResponse } from "@/utils/type/common/type"
import axios, { AxiosError } from "axios"

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
  pageSize?: number,
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
      (filter.maxPrice !== undefined && filter.maxPrice !== null) ||
      (filter.region !== undefined && filter.region !== null))

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
    if (filter.region !== undefined && filter.region !== null) {
      query += `&region=${encodeURIComponent(filter.region)}`
    }
  }
  console.log(`${endPoint}${query}`)
  const response = await api.get<CommonResponse<PostPageResponseData>>(
    `${endPoint}${query}`
  )
  console.log(response.data)
  return response.data
}

export const deletePost = async (
  postId: number | undefined
): Promise<CommonResponse<void>> => {
  const response = await api.delete<CommonResponse<void>>(`/post/${postId}`)
  return response.data
}

export const updatePost = async (
  postId: number | undefined,
  payload: any
): Promise<PostResponse | null> => {
  const response = await api.put(`post/${postId}`, payload)
  return response.data
}

export const setFavorite = async (
  postId: number | undefined
): Promise<LikeResponse | null> => {
  const response = await api.post(`/post/${postId}/cart`)
  console.log(response.data)
  return response.data.data
}

export const uploadBase64ImageAPI = async (base64: string): Promise<string> => {
  try {
    const response = await api.post(
      `/image/upload`,
      { base64Image: base64 },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    console.log(response.data.data)
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      if (axiosError.response) {
        const serverMessage = (axiosError.response.data as any)?.message
        console.error(
          "이미지 업로드 실패 (서버 응답):",
          axiosError.response?.status,
          serverMessage || "알 수 없는 서버 오류"
        )
        throw new Error(
          serverMessage || "이미지 업로드 중 서버에서 오류가 발생했습니다."
        )
      } else if (axiosError.request) {
        console.error("이미지 업로드 실패 (네트워크 오류):", axiosError.message)
        throw new Error(
          "네트워크 오류로 이미지 업로드에 실패했습니다. 인터넷 연결을 확인해주세요."
        )
      } else {
        console.error(
          "이미지 업로드 실패 (요청 설정 오류):",
          axiosError.message
        )
        throw new Error("이미지 업로드 요청에 문제가 발생했습니다.")
      }
    } else {
      console.error("이미지 업로드 실패 (알 수 없는 오류):", error)
      throw new Error("예상치 못한 오류로 이미지 업로드에 실패했습니다.")
    }
  }
}

export const changeStatus = async (
  postId: Number | undefined
): Promise<PostResponse | null> => {
  if (postId === undefined) {
    console.warn("postId is undefined")
    return null
  }
  try {
    const response = await api.put(`/post/${postId}/status`)
    console.log(response.data.data)
    return response.data
  } catch (error) {
    console.error("Failed to change status", error)
    return null
  }
}

export const getRegionInfo = async (): Promise<string[] | null> => {
  try {
    const response = await api.get("/post/region")
    if (!response) return null
    console.log(response.data.data.regions)
    return response.data.data.regions
  } catch (error) {
    console.error("Failed to change status", error)
    return null
  }
}
