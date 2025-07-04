import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshToken } from "./auth/api";

const ACCESS_TOKEN_HEADER = "Bearer ";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

// 요청 인터셉터: accessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers["authorization"] = `${ACCESS_TOKEN_HEADER}${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: accessToken 만료 시 자동 리프레시
// 테스트 필요
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refreshToken API 호출 (쿠키로 자동 전송)
        const res = await refreshToken();
        const newAccessToken = res.headers["authorization"];
        const user = useAuthStore.getState().user;
        if (user) {
          useAuthStore.getState().login(user, newAccessToken);
          originalRequest.headers["authorization"] = newAccessToken;
          return api(originalRequest);
        } else {
          useAuthStore.getState().logout();
          return Promise.reject(
            new Error("유저 정보가 없습니다. 다시 로그인 해주세요.")
          );
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
