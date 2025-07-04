"use client";

import RefreshTestButton from "@/components/button/RefreshTestButton";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/button/LogoutButton";
import LoginButton from "./button/LoginButton";
import RegisterButton from "./button/RegisterButton";
import MainHeader from "@/components/header/MainHeader";

export default function MainPageContent() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const email =
      typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (token && email) {
      login({ email }, token);
    }
    setInitialized();
  }, [login, setInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-white">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff8177] flex flex-col items-center relative overflow-x-hidden">
      <MainHeader>
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center w-full pt-40 pb-16 px-4">
        <div className="flex flex-col items-center mb-6">
          <span className="text-6xl md:text-7xl mb-2 animate-bounce">🍅</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#e53935] mb-4 drop-shadow-lg tracking-tight">
            토마토와 함께하는 중고 물품 거래
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-800 mb-10 font-medium drop-shadow text-center max-w-xl">
          신선한 중고 거래,{" "}
          <span className="text-[#e53935] font-bold">토마토마켓</span>에서
          <br />
          믿을 수 있는 이웃과 따뜻하게 거래하세요!
        </p>
        {!isLoggedIn ? (
          <>
            <button
              className="px-10 py-4 bg-[#e53935] text-white text-xl font-bold rounded-full shadow-lg hover:bg-[#d32f2f] hover:scale-105 transition-all duration-200 cursor-pointer mb-4"
              onClick={() => router.push("/posts")}
            >
              중고 물품 둘러보기
            </button>
            <div className="flex gap-3 mt-2">
              <LoginButton className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all" />
              <RegisterButton className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl text-[#e53935] font-bold mb-3 drop-shadow">
              {user?.email}님, 환영합니다!
            </div>
            <div className="text-lg text-gray-700 mb-8 font-medium">
              오늘도 토마토마켓에서 좋은 거래 하세요 🍅
            </div>
            <button
              className="px-10 py-4 bg-[#e53935] text-white text-xl font-bold rounded-full shadow-lg hover:bg-[#d32f2f] hover:scale-105 transition-all duration-200 mb-4"
              onClick={() => router.push("/posts")}
            >
              중고 물품 목록 보기
            </button>
          </div>
        )}
      </main>
      {isLoggedIn && (
        <div className="fixed bottom-8 right-8 z-30">
          <RefreshTestButton />
        </div>
      )}
      {/* 헤더 공간 확보용 더미 */}
      <div className="h-24 w-full" />
      </MainHeader>
    </div>
  );
}
