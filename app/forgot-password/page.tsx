"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    setLoading(true);
    // 실제 API 연동은 추후 구현
    setTimeout(() => {
      setLoading(false);
      setSuccess(
        "비밀번호 재설정 메일을 발송했습니다. 메일함을 확인해 주세요."
      );
    }, 1200);
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
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#e53935]"
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
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-[#e53935] text-white py-3 rounded-md text-base font-semibold hover:bg-[#d32f2f] transition-colors mb-4 disabled:opacity-50 shadow-lg"
            disabled={loading}
          >
            {loading ? "메일 발송 중..." : "비밀번호 재설정 메일 보내기"}
          </button>
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
