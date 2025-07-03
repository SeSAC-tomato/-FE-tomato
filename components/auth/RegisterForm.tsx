"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { checkEmailDuplicate } from "@/utils/api/auth/api";
import CheckModal from "../modals/CheckModal";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [emailValify, setEmailValify] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameValify, setNicknameValify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [address, setAddress] = useState("");

  // 이메일 중복 검사 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [canUse, setCanUse] = useState(false);

  // 이메일 중복 검사
  const handleCheckEmail = async () => {
    if (!email) return;
    try {
      const data = await checkEmailDuplicate(email);

      if (data.data) {
        if (data.data.duplication) {
          setModalMessage(data.data.message);
          setCanUse(!data.data.duplication);
        } else {
          setModalMessage(data.data.message);
          setCanUse(!data.data.duplication);
        }
      }
    } catch {
      setModalMessage("오류가 발생했습니다.");
      setCanUse(false);
    }
    setIsModalOpen(true);
  };

  // 모달에서 사용 버튼 클릭
  const handleUseEmail = () => {
    setEmailValify(true);
    setIsModalOpen(false);
  };

  // 모달 닫기
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form className="w-full max-w-md flex flex-col items-center">
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
              className={
                "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-400" +
                (emailValify
                  ? " bg-gray-200 text-gray-400 cursor-not-allowed"
                  : " bg-gray-100")
              }
              disabled={emailValify}
            />
          </div>
          <button
            type="button"
            className={
              "ml-2 mt-6 px-4 py-2 rounded-md font-semibold " +
              (emailValify
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-black text-white")
            }
            onClick={handleCheckEmail}
            disabled={emailValify}
          >
            {emailValify ? "검사 완료" : "중복 검사"}
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
              placeholder="주소 검색색"
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
      {/* 중복 검사 모달 */}
      <CheckModal
        open={isModalOpen}
        message={modalMessage}
        canUse={canUse}
        onUse={handleUseEmail}
        onClose={handleCloseModal}
      />
    </div>
  );
}
