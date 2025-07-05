'use client'
import axios from 'axios'

export async function removeFromCart(userId: number, postId: number) {
    return axios.delete(`/api/v1/user/${userId}/cart/${postId}`)
}