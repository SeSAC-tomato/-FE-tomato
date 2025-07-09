"use client";
import { useState, use } from "react";
import api from "@/utils/api/axios";
import MainHeader from "@/components/header/MainHeader";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import { changeUserPassword } from "@/utils/api/user/api";

export default function PasswordChangePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");

  // 비밀번호 정규식
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  // 비밀번호 입력 시 정규식 검사
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    if (!passwordRegex.test(value)) {
      setPasswordError(
        "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 입력 후 포커스 아웃 시 검사
  const handleNewPasswordCheckBlur = () => {
    if (newPasswordCheck && newPassword !== newPasswordCheck) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordCheckError("");
    }
  };

  // 비밀번호 조건별 체크
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
  const hasLength = newPassword.length >= 8;

  // 변경 버튼 활성화 조건
  const isFormValid =
    oldPassword.length > 0 &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    hasLength &&
    newPassword === newPasswordCheck;

  const handleChange = async () => {
    try {
      await changeUserPassword(
        Number(userId),
        oldPassword,
        newPassword,
        newPasswordCheck
      );
      alert("비밀번호가 변경되었습니다");
      setOldPassword("");
      setNewPassword("");
      setNewPasswordCheck("");
    } catch (e) {
      alert("비밀번호 변경에 실패했습니다");
    }
  };

  return (
    <>
      <MainHeader />
      <div className="flex w-full max-w-4xl mx-auto mt-8">
        <MyPageMenu userId={Number(userId)} className="self-start h-fit" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">비밀번호 변경</h1>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="기존 비밀번호"
            className="mb-2 border rounded px-2 py-1"
          />
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="새 비밀번호"
            className="mb-2 border rounded px-2 py-1"
          />
          {/* 비밀번호 조건별 체크 UI */}
          <div className="mb-2 space-y-1 text-xs">
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
          <input
            type="password"
            value={newPasswordCheck}
            onChange={(e) => setNewPasswordCheck(e.target.value)}
            onBlur={handleNewPasswordCheckBlur}
            placeholder="새 비밀번호 확인"
            className="mb-2 border rounded px-2 py-1"
          />
          {newPasswordCheck && newPassword !== newPasswordCheck && (
            <p className="text-red-500 text-xs mb-1">
              변경할 비밀번호가 확인 비밀번호와 일치하지 않습니다
            </p>
          )}
          {passwordError && (
            <p className="text-red-500 text-xs mb-1">{passwordError}</p>
          )}
          <button
            onClick={handleChange}
            className={`px-4 py-2 rounded ${
              isFormValid
                ? "bg-gray-200 text-black hover:bg-gray-300"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            변경
          </button>
        </div>
      </div>
    </>
  );
}
