"use client";

import Image from "next/image";
import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-500">
      <form className="w-full max-w-md bg-transparent flex flex-col items-center">
        {/* 로고 */}
        <div className="mb-3">
          <Image src="/logo.svg" alt="logo" width={36} height={36} />
        </div>
        {/* 제목 */}
        <h2 className="mb-8 font-medium text-xl text-center">회원가입</h2>
        {/* 이메일 */}
        <div className="w-full flex items-center mb-3">
          <div className="flex-1">
            <label className="text-sm font-semibold">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
          <button
            type="button"
            className="ml-2 mt-6 px-4 py-2 bg-black text-white rounded-md font-semibold"
          >
            중복 검사
          </button>
        </div>
        {/* 닉네임 */}
        <div className="w-full flex items-center mb-3">
          <div className="flex-1">
            <label className="text-sm font-semibold">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력해 주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
          <button
            type="button"
            className="ml-2 mt-6 px-4 py-2 bg-black text-white rounded-md font-semibold"
          >
            중복 검사
          </button>
        </div>
        {/* 비밀번호 */}
        <div className="w-full mb-3">
          <label className="text-sm font-semibold">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
        {/* 비밀번호 확인 */}
        <div className="w-full mb-3">
          <label className="text-sm font-semibold">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
        {/* 주소 */}
        <div className="w-full flex items-center mb-8">
          <div className="flex-1">
            <label className="text-sm font-semibold">주소</label>
            <input
              type="text"
              placeholder="닉네임을 입력해 주세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
          <button
            type="button"
            className="ml-2 mt-6 px-4 py-2 bg-black text-white rounded-md font-semibold"
          >
            주소 검색
          </button>
        </div>
        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md text-base font-semibold hover:bg-neutral-800 transition-colors"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
