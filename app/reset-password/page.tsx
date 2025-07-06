"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { passwordChanger } from "@/utils/api/auth/api";
import { VerifyType } from "@/utils/type/auth/type";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 비밀번호 정규식 (회원가입과 동일)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  // 비밀번호 입력 시 정규식 검사
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  // 비밀번호 확인 입력 후 포커스 아웃 시 검사
  const handlePasswordCheckBlur = () => {
    if (passwordConfirm && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
    } else {
      setError("");
    }
  };

  // 비밀번호 조건별 체크
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const hasLength = password.length >= 8;

  // 폼 유효성 검사
  useEffect(() => {
    const isPasswordValid =
      hasUpper && hasLower && hasNumber && hasSpecial && hasLength;
    const isPasswordMatch = password === passwordConfirm;
    const isPasswordNotEmpty = password.length > 0;
    const isConfirmNotEmpty = passwordConfirm.length > 0;

    setIsValid(
      isPasswordValid &&
        isPasswordMatch &&
        isPasswordNotEmpty &&
        isConfirmNotEmpty
    );
  }, [
    password,
    passwordConfirm,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    hasLength,
  ]);

  // URL 파라미터 검증
  useEffect(() => {
    if (!token || !email) {
      router.replace("/error/bad-request");
      return;
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValid) {
      setError("비밀번호 조건을 확인해 주세요.");
      return;
    }

    setLoading(true);
    setIsSubmitted(true);

    try {
      const res = await passwordChanger(
        email ?? "",
        token ?? "",
        VerifyType.PASSWORD,
        password,
        passwordConfirm
      );

      if (res.status === 200) {
        setSuccess("비밀번호가 성공적으로 변경되었습니다!");
        setLoading(false);

        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
        setLoading(false);
        setIsSubmitted(false);
      }
    } catch (error: any) {
      console.error("비밀번호 재설정 오류:", error);

      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.error?.message;

        if (status === 400) {
          setError(errorMessage || "비밀번호 형식이 올바르지 않습니다.");
        } else if (status === 401) {
          setError(
            errorMessage || "토큰이 만료되었습니다. 다시 시도해 주세요."
          );
        } else if (status === 404) {
          setError(errorMessage || "유효하지 않은 요청입니다.");
        } else if (status === 409) {
          setError(
            errorMessage ||
              "이미 사용된 비밀번호입니다. 다른 비밀번호를 입력해 주세요."
          );
        } else {
          setError(
            errorMessage || "비밀번호 변경에 실패했습니다. 다시 시도해 주세요."
          );
        }
      } else {
        setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.");
      }
      setLoading(false);
      setIsSubmitted(false);
    }
  };

  if (!token || !email) {
    return null;
  }

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
          새 비밀번호 설정
        </h2>
        <p className="mb-6 text-gray-600 text-center text-sm">
          새로운 비밀번호를 입력해 주세요
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full mb-4">
            <label className="text-sm font-semibold">새 비밀번호</label>
            <input
              type="password"
              placeholder="새 비밀번호를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#e53935] disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading || isSubmitted}
              required
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

          <div className="w-full mb-4">
            <label className="text-sm font-semibold">새 비밀번호 확인</label>
            <input
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onBlur={handlePasswordCheckBlur}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#e53935] disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading || isSubmitted}
              required
            />
            {passwordConfirm.length > 0 && password !== passwordConfirm && (
              <p className="text-xs mt-1 text-red-500">
                비밀번호가 일치하지 않습니다
              </p>
            )}
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
            className="w-full bg-[#e53935] text-white py-3 rounded-md text-base font-semibold hover:bg-[#d32f2f] transition-colors mb-4 disabled:opacity-50 shadow-lg disabled:cursor-not-allowed"
            disabled={loading || !isValid || isSubmitted}
          >
            {loading
              ? "비밀번호 변경 중..."
              : isSubmitted
              ? "변경 완료"
              : "비밀번호 변경"}
          </button>

          <div className="w-full flex justify-center text-sm mt-2">
            <a
              href="#"
              className="text-[#e53935] underline hover:text-[#b71c1c]"
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
            >
              로그인으로 돌아가기
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
