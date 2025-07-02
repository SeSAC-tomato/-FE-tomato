"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-md mt-24 border border-gray-200 rounded-lg px-8 pt-10 pb-6 flex flex-col items-center">
      {/* 로고 */}
      <div className="mb-3">
        <Image src="/logo.svg" alt="logo" width={36} height={36} />
      </div>
      {/* 로그인 텍스트 */}
      <h2 className="mb-6 font-medium text-xl">로그인</h2>
      {/* 이메일 입력 */}
      <div className="w-full mb-3">
        <label className="text-sm font-semibold">이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
      </div>
      {/* 로그인 버튼 */}
      <button className="w-full bg-black text-white py-3 rounded-md text-base font-semibold hover:bg-neutral-800 transition-colors mb-4">
        로그인
      </button>
      {/* 하단 링크 */}
      <div className="w-full flex justify-between text-sm">
        <a href="#" className="text-black underline hover:text-neutral-600">
          비밀번호를 잊어버리셨나요?
        </a>
        <a href="#" className="text-black underline hover:text-neutral-600">
          회원가입
        </a>
      </div>
    </div>
  );
}
