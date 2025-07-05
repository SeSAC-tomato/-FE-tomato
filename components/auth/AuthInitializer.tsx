"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshToken } from "@/utils/api/auth/api";
import axios from "axios";
import api from "@/utils/api/axios";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, login, user } = useAuthStore();

  // useEffect(() => {
  //   if (!accessToken) {
  //     refreshToken()
  //       .then((res) => {
  //         const newAccessToken = res.headers["authorization"];
  //         if (newAccessToken) {
  //           login(user ?? { email: "" }, newAccessToken);

  //         }
  //       })
  //       .catch(() => {});
  //   }
  // }, []);

  useEffect(() => {
    // 1. accessToken이 없으면 refreshToken 시도
    if (!accessToken) {
      refreshToken()
        .then((res) => {
          const newAccessToken = res.headers["authorization"];
          if (newAccessToken) {
            login(
              user ?? { email: "", id: 0, nickname: "", address: "" },
              newAccessToken
            );
            // 2. 토큰이 생기면 user/me 호출
            api
              .get("/user/me")
              .then((userRes) => {
                console.log("user/me 응답:", userRes.data);
                const user = userRes.data.data;
                if (!user) return; // 유저 정보 없으면 저장하지 않음
                const userData = {
                  id: user.id,
                  nickname: user.nickname,
                  email: user.email,
                  address: user.address,
                };
                useAuthStore.getState().login(userData, newAccessToken);
              })
              .catch(() => {
                // user/me 실패 시 처리
              });
          }
        })
        .catch(() => {});
    } else {
      // accessToken이 이미 있으면 바로 user/me 호출
      api
        .get("/user/me")
        .then((userRes) => {
          console.log("user/me 응답:", userRes.data);
          const user = userRes.data.data;
          const userData = {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            address: user.address,
          };
          useAuthStore.getState().login(userData, accessToken);
        })
        .catch(() => {
          // user/me 실패 시 처리
        });
    }
  }, []);

  return <>{children}</>;
}
