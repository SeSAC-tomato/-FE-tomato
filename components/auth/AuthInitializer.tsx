"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshToken } from "@/utils/api/auth/api";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, login, user } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      refreshToken()
        .then((res) => {
          const newAccessToken = res.headers["authorization"];
          if (newAccessToken) {
            login(user ?? { email: "" }, newAccessToken);
          }
        })
        .catch(() => {});
    }
  }, []);

  return <>{children}</>;
}
