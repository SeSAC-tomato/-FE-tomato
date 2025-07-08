import api from "@/utils/api/axios";

export const removeFromCart = (userId: number, postId: number) => {
  return api.delete(`/user/${userId}/cart/${postId}`);
};

export const getCartItems = (
  userId: number,
  page = 0,
  size = 12,
  likeSort = "LIKE_CREATED_AT"
) => {
  return api.get(
    `/user/${userId}/cart?currentPage=${page}&size=${size}&likeSort=${likeSort}`
  );
};

export const getMyPosts = (userId: number) => {
  return api.get(`/user/${userId}/posts/myPosts`);
};

export const changeUserPassword = (
  userId: number,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  return api.put(`/user/${userId}/password`, {
    currentPassword,
    newPassword,
    confirmPassword,
  });
};

export const updateUserProfile = (
  userId: number,
  nickname: string,
  address: string,
  sido: string,
  sigungu: string,
  dong: string,
  x: number,
  y: number
) => {
  return api.put(`/user/${userId}/profile`, {
    nickname,
    address,
    sido,
    sigungu,
    dong,
    x,
    y,
  });
};
