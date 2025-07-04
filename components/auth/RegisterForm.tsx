"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  register,
} from "@/utils/api/auth/api";
import CheckModal from "../modals/CheckModal";
import { useRouter } from "next/navigation";

type ModalType = "email" | "nickname" | null;

declare global {
  interface Window {
    daum: any;
  }
}

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [emailValify, setEmailValify] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameValify, setNicknameValify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [address, setAddress] = useState("");

  // 중복 검사 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [canUse, setCanUse] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");

  const router = useRouter();

  // 카카오 주소 검색 스크립트 동적 로드
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.daum && window.daum.Postcode) return;
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 주소 검색 핸들러
  const handleSearchAddress = () => {
    if (typeof window === "undefined" || !window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setAddress(data.address);
      },
    }).open();
  };

  // 이메일 중복 검사
  const handleCheckEmail = async () => {
    if (!email) return;
    // 이메일 형식 검사
    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setModalMessage("올바른 이메일 형식이 아닙니다.");
      setCanUse(false);
      setModalType("email");
      setIsModalOpen(true);
      return;
    }
    try {
      const data = await checkEmailDuplicate(email);
      if (data.data) {
        setModalMessage(data.data.message);
        setCanUse(!data.data.duplication);
      }
    } catch {
      setModalMessage("오류가 발생했습니다.");
      setCanUse(false);
    }
    setModalType("email");
    setIsModalOpen(true);
  };

  // 닉네임 중복 검사
  const handleCheckNickname = async () => {
    if (!nickname) return;
    try {
      const data = await checkNicknameDuplicate(nickname);
      if (data.data) {
        setModalMessage(data.data.message);
        setCanUse(!data.data.duplication);
      }
    } catch {
      setModalMessage("오류가 발생했습니다.");
      setCanUse(false);
    }
    setModalType("nickname");
    setIsModalOpen(true);
  };

  // 모달에서 사용 버튼 클릭
  const handleUse = () => {
    if (modalType === "email") setEmailValify(true);
    if (modalType === "nickname") setNicknameValify(true);
    setIsModalOpen(false);
    setModalType(null);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    // 이메일 모달일 때 이메일 input에 포커스
    if (modalType === "email" && emailInputRef.current && !emailValify) {
      emailInputRef.current.focus();
    }
  };

  // 비밀번호 정규식
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  // 비밀번호 입력 시 정규식 검사
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!passwordRegex.test(value)) {
      setPasswordError(
        "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 입력 후 포커스 아웃 시 검사
  const handlePasswordCheckBlur = () => {
    if (passwordCheck && password !== passwordCheck) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordCheckError("");
    }
  };

  // 비밀번호 조건별 체크
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const hasLength = password.length >= 8;

  // 회원가입 버튼 활성화 조건
  const isFormValid =
    emailValify &&
    nicknameValify &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    hasLength &&
    password === passwordCheck &&
    address.length > 0;

  // 회원가입 폼 제출
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        passwordConfirm: passwordCheck,
        nickname,
        address,
      });
      alert("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "회원가입에 실패했습니다.");
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
        <h2 className="mb-2 font-bold text-xl text-gray-900">회원가입</h2>
        <p className="mb-6 text-gray-600 text-center text-sm">
          믿을 수 있는 이웃과 함께, 토마토마켓에서 중고 거래를 시작하세요!
        </p>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleRegister}
        >
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
                ref={emailInputRef}
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
                className={
                  "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-400" +
                  (nicknameValify
                    ? " bg-gray-200 text-gray-400 cursor-not-allowed"
                    : " bg-gray-100")
                }
                disabled={nicknameValify}
              />
            </div>
            <button
              type="button"
              className={
                "ml-2 mt-6 px-4 py-2 rounded-md font-semibold " +
                (nicknameValify
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white")
              }
              onClick={handleCheckNickname}
              disabled={nicknameValify}
            >
              {nicknameValify ? "검사 완료" : "중복 검사"}
            </button>
          </div>
          {/* 비밀번호 */}
          <div className="w-full mb-3">
            <label className="text-sm font-semibold">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={handlePasswordChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
            {/* 비밀번호 조건별 체크 UI */}
            <div className="mt-2 space-y-1 text-xs">
              <div className={hasUpper ? "text-green-600" : "text-gray-400"}>
                {hasUpper ? "✔" : "✖"} 영문 대문자 포함
              </div>
              <div className={hasLower ? "text-green-600" : "text-gray-400"}>
                {hasLower ? "✔" : "✖"} 영문 소문자 포함
              </div>
              <div className={hasNumber ? "text-green-600" : "text-gray-400"}>
                {hasNumber ? "✔" : "✖"} 숫자 포함
              </div>
              <div className={hasSpecial ? "text-green-600" : "text-gray-400"}>
                {hasSpecial ? "✔" : "✖"} 특수문자 포함
              </div>
              <div className={hasLength ? "text-green-600" : "text-gray-400"}>
                {hasLength ? "✔" : "✖"} 8자 이상
              </div>
            </div>
          </div>
          {/* 비밀번호 확인 */}
          <div className="w-full mb-3">
            <label className="text-sm font-semibold">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              onBlur={handlePasswordCheckBlur}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
            {passwordCheckError && (
              <p className="text-red-500 text-xs mt-1">{passwordCheckError}</p>
            )}
          </div>
          {/* 주소 */}
          <div className="w-full flex items-center mb-8">
            <div className="flex-1">
              <label className="text-sm font-semibold">주소</label>
              <input
                type="text"
                placeholder="주소 검색"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                readOnly
              />
            </div>
            <button
              type="button"
              className="ml-2 mt-6 px-4 py-2 bg-black text-white rounded-md font-semibold"
              onClick={handleSearchAddress}
            >
              주소 검색
            </button>
          </div>
          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className={
              "w-full py-3 rounded-md text-base font-semibold transition-colors " +
              (isFormValid
                ? "bg-black text-white hover:bg-neutral-800 cursor-pointer"
                : "bg-gray-300 text-gray-400 cursor-not-allowed")
            }
            disabled={!isFormValid}
          >
            회원가입
          </button>
        </form>
      </div>
      {/* 중복 검사 모달 */}
      <CheckModal
        open={isModalOpen}
        message={modalMessage}
        canUse={canUse}
        onUse={handleUse}
        onClose={handleCloseModal}
      />
    </div>
  );
}
