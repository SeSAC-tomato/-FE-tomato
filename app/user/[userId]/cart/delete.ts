"use client";
import { removeFromCart as removeFromCartApi } from "@/utils/api/user/api";

export async function removeFromCart(userId: number, postId: number) {
  return removeFromCartApi(userId, postId);
}
