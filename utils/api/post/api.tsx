import { PostCreatePayload } from "@/utils/type/post/type"
import axios from "axios"
import { PostResponse } from "@/utils/type/post/type"
import api from "../axios"

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
