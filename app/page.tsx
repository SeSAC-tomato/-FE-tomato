"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

export default function MainPage() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/posts");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-700 flex flex-col items-center">
      {/* 상단 헤더 */}
      <header className="w-full flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <span className="text-2xl font-bold text-white">tomato</span>
        </div>
        <div>
          {!isLoggedIn ? (
            <>
              <button
                className="mr-4 px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 hover:scale-105 transition duration-200 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                로그인
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 hover:scale-105 transition duration-200 cursor-pointer"
                onClick={() => router.push("/register")}
              >
                회원가입
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-gray-200 text-black rounded font-semibold hover:bg-gray-300 hover:scale-105 transition duration-200 cursor-pointer"
              onClick={logout}
            >
              로그아웃
            </button>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          토마토에 오신 것을 환영합니다!
        </h1>
        <p className="text-lg text-gray-200 mb-10">
          로그인 없이 둘러볼 수도 있고, 회원가입 후 더 많은 기능을 이용할 수
          있습니다.
        </p>
        {!isLoggedIn ? (
          <button
            className="px-8 py-4 bg-white text-black text-lg font-semibold rounded shadow hover:bg-gray-100 hover:scale-105 transition duration-200 cursor-pointer"
            onClick={() => router.push("/posts")}
          >
            둘러보기(게스트)
          </button>
        ) : (
          <div className="text-2xl text-white font-semibold">
            {user?.email}님, 환영합니다!
          </div>
        )}
      </main>
    </div>
  );
}
