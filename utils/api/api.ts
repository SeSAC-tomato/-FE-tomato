import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:8080/api/v1`, //
    withCredentials: true, // 모든 요청에 쿠키 포함
})

// 요청 인터셉터: accessToken 자동 첨부
api.interceptors.request.use(
    (config) => {
      // zustand에서 accessToken 가져오기 (함수 내에서 직접 import 불가, 아래 참고)
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers["Authorization"] = accessToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default api;

// 사용법 (토큰이 필요한 요청의 경우에 한해서서)
// import api from "@/utils/api/axios";

// const res = await api.get("/posts"); // 자동으로 헤더/쿠키 포함