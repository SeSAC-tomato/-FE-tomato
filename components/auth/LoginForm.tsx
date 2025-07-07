"use client";

import Image from "next/image";
import { useState } from "react";
import { Login as loginApi } from "@/utils/api/auth/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import api from "@/utils/api/axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. 로그인 API 호출 (토큰 발급)
      const accessToken = await loginApi(email, password);

      // 2. user/me로 유저 정보 받아 zustand에 저장
      const userRes = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = userRes.data.data;
      setAuth(user, accessToken); // user 전체 정보와 토큰을 zustand에 저장

      // 3. 메인 페이지로 이동
      router.push("/");
    } catch (err: any) {
      let msg =
        err?.error?.message ||
        err?.message ||
        "로그인에 실패했습니다. 다시 시도해 주세요.";
      if (
        msg.includes("Request failed") ||
        msg.includes("404") ||
        msg.includes("500")
      ) {
        msg = "아이디 또는 비밀번호가 올바르지 않습니다.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-full max-w-md bg-white/90 rounded-xl shadow-xl px-8 pt-12 pb-10 flex flex-col items-center z-10">
        <div className="mb-4 flex flex-col items-center">
          <Image src="/logo.svg" alt="logo" width={48} height={48} />
          <span className="text-2xl font-extrabold text-[#e53935] flex items-center gap-2 mt-2">
            토마토마켓 <span className="text-xl animate-bounce">🍅</span>
          </span>
        </div>
        <h2 className="mb-2 font-bold text-xl text-gray-900">로그인</h2>
        <p className="mb-6 text-gray-600 text-center text-sm">
          신선한 중고 거래, 토마토마켓에서 시작하세요!
        </p>
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col items-center"
        >
          {/* 이메일 입력 */}
          <div className="w-full mb-3">
            <label className="text-sm font-semibold">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#e53935]"
            />
          </div>
          {/* 비밀번호 입력 */}
          <div className="w-full mb-5">
            <label className="text-sm font-semibold">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#e53935]"
            />
          </div>
          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="w-full text-red-500 text-sm mb-3 text-center">
              {errorMsg}
            </div>
          )}
          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#e53935] text-white py-3 rounded-md text-base font-semibold hover:bg-[#d32f2f] transition-colors mb-4 disabled:opacity-50 shadow-lg"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          {/* 하단 링크 */}
          <div className="w-full flex justify-between text-sm mt-2">
            <a
              href="#"
              className="text-[#e53935] underline hover:text-[#b71c1c]"
              onClick={(e) => {
                e.preventDefault();
                router.push("/forgot-password");
              }}
            >
              비밀번호를 잊어버리셨나요?
            </a>
            <a
              href="#"
              className="text-[#e53935] underline hover:text-[#b71c1c]"
              onClick={(e) => {
                e.preventDefault();
                router.push("/register");
              }}
            >
              회원가입
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
