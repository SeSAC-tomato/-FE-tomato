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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// 응답 인터셉터: accessToken 만료 시 자동 리프레시
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // refresh 요청에서 401이 오면 바로 로그아웃/리다이렉트
    if (
      originalRequest.url.includes("/auth/refresh") &&
      error.response?.status === 401
    ) {
      // 로그아웃 처리, 로그인 페이지 이동 등
      useAuthStore.getState().logout();
      // 예: window.location.href = "/login";
      return Promise.reject(error);
    }

    // accessToken 만료 등으로 401이 오고, 아직 refresh 시도 안 했을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 refresh 중이면 큐에 쌓기
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const res = await refreshToken();
          const newAccessToken = res.headers["authorization"];
          // 토큰 저장 및 헤더 갱신
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + newAccessToken;
          processQueue(null, newAccessToken);
          resolve(axios(originalRequest));
        } catch (err) {
          processQueue(err, null);
          // 여기서 로그아웃/리다이렉트 등 처리
          // 예: window.location.href = "/login";
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;
