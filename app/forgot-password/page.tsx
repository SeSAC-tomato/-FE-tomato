"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { passwordVerify } from "@/utils/api/auth/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("이메일을 입력해 주세요.");
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await passwordVerify(email);
      console.log(res);

      if (res.status === 201) {
        setSuccess(
          "비밀번호 재설정 메일이 발송되었습니다. 이메일을 확인해 주세요."
        );
        setLoading(false);
        setIsSuccess(true);
        // 3초 카운트다운 후 로그인 화면으로 이동
        let count = 3;
        const countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(countdownInterval);
            router.push("/login");
          }
        }, 1000);
      } else {
        setError("메일 발송에 실패했습니다. 다시 시도해 주세요.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("비밀번호 재설정 메일 발송 오류:", error);

      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setError("등록되지 않은 이메일입니다.");
        } else if (status === 400) {
          setError("잘못된 이메일 형식입니다.");
        } else if (status === 429) {
          setError(
            "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요."
          );
        } else {
          setError("메일 발송에 실패했습니다. 다시 시도해 주세요.");
        }
      } else {
        setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative w-full max-w-md bg-white/90 rounded-xl shadow-xl px-8 pt-12 pb-10 flex flex-col items-center z-10">
        <div className="mb-4 flex flex-col items-center">
          <Image src="/logo.svg" alt="logo" width={48} height={48} />
          <span className="text-2xl font-extrabold text-[#e53935] flex items-center gap-2 mt-2">
            토마토마켓 <span className="text-xl animate-bounce">🍅</span>
          </span>
        </div>
        <h2 className="mb-2 font-bold text-xl text-gray-900">
          비밀번호 재설정
        </h2>
        <p className="mb-6 text-gray-600 text-center text-sm">
          가입하신 이메일을 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full mb-4">
            <label className="text-sm font-semibold">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#e53935] disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
              required
            />
          </div>
          {error && (
            <div className="w-full text-red-500 text-sm mb-3 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full text-green-600 text-sm mb-3 text-center">
              {success}
              {isSuccess && (
                <div className="text-gray-500 text-xs mt-1">
                  {countdown}초 후 로그인 화면으로 이동합니다...
                </div>
              )}
            </div>
          )}
          {!isSuccess && (
            <button
              type="submit"
              className="w-full bg-[#e53935] text-white py-3 rounded-md text-base font-semibold hover:bg-[#d32f2f] transition-colors mb-4 disabled:opacity-50 shadow-lg"
              disabled={loading}
            >
              {loading ? "메일 발송 중..." : "비밀번호 재설정 메일 보내기"}
            </button>
          )}
          <div className="w-full flex justify-between text-sm mt-2">
            <a
              href="#"
              className="text-[#e53935] underline hover:text-[#b71c1c]"
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
            >
              로그인
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
