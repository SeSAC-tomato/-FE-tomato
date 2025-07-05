"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verify } from "@/utils/api/auth/api";
import Image from "next/image";

export default function PasswordVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "loading" | "success" | "fail" | "expired" | "bad-request"
  >("loading");
  const [message, setMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setStatus("bad-request");
      setMessage("잘못된 접근입니다.");
      return;
    }

    async function doVerify() {
      try {
        setStatus("loading");
        setMessage("비밀번호 재설정 토큰을 확인 중입니다...");

        // 실제 API 호출 시에는 로딩 시간을 줄일 수 있습니다
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const res = await verify(email ?? "", token ?? "", "PASSWORD");

        if (res.status === 200) {
          setStatus("success");
          setMessage("비밀번호 재설정 토큰이 유효합니다!");
        } else {
          setMessage(res.data?.error?.message || "토큰 인증에 실패했습니다.");
          setErrorCode(res.data?.error?.code || "");
          setStatus("fail");
        }
      } catch (e: any) {
        console.error("비밀번호 재설정 토큰 인증 오류:", e);

        const errorMessage = e?.response?.data?.error?.message;
        const errorCode = e?.response?.data?.error?.code;

        if (errorCode === "TOMATO_AUTH_001") {
          setStatus("bad-request");
          setMessage(errorMessage);
        } else if (errorCode === "TOMATO_AUTH_011") {
          setStatus("expired");
          setMessage("비밀번호 재설정 링크가 만료되었습니다.");
        } else if (errorCode === "TOMATO_AUTH_009") {
          setStatus("bad-request");
          setMessage("유효하지 않은 토큰입니다.");
        } else if (errorCode === "TOMATO_AUTH_012") {
          setStatus("bad-request");
          setMessage("유효하지 않은 인증입니다.");
        } else {
          setStatus("fail");
          setMessage(errorMessage || "토큰 인증에 실패했습니다.");
        }
        setErrorCode(errorCode || "");
      }
    }

    doVerify();
  }, [token, email]);

  // 상태별 아이콘/버튼/색상
  const getIcon = () => {
    switch (status) {
      case "success":
        return <div className="text-5xl mb-4">✅</div>;
      case "fail":
      case "bad-request":
        return <div className="text-5xl mb-4">❌</div>;
      case "expired":
        return <div className="text-5xl mb-4">⏰</div>;
      default:
        return (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e53935] mb-4"></div>
        );
    }
  };

  const getColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "fail":
      case "bad-request":
        return "text-red-500";
      case "expired":
        return "text-yellow-600";
      default:
        return "text-gray-700";
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "success":
        return "비밀번호 재설정하기";
      case "expired":
        return "비밀번호 재설정 다시 요청";
      default:
        return "메인으로";
    }
  };

  const handleButtonClick = () => {
    switch (status) {
      case "success":
        router.push(`/reset-password?token=${token}&email=${email}`);
        break;
      case "expired":
        router.push("/forgot-password");
        break;
      default:
        router.push("/");
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-12 flex flex-col items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={48}
          height={48}
          className="mb-4"
        />
        <h2 className="text-2xl font-bold mb-6 text-[#e53935]">
          비밀번호 재설정
        </h2>

        {getIcon()}

        <p className={`mb-2 font-bold text-lg ${getColor()} text-center`}>
          {message}
        </p>

        {status !== "loading" && (
          <button
            className={`mt-6 px-6 py-3 text-white rounded-md font-semibold text-base shadow transition ${
              status === "success"
                ? "bg-[#e53935] hover:bg-[#d32f2f]"
                : status === "expired"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={handleButtonClick}
          >
            {getButtonText()}
          </button>
        )}

        {/* 추가 안내 메시지 */}
        {status === "expired" && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            새로운 비밀번호 재설정 링크를 받으시려면
            <br />
            이메일 주소를 다시 입력해 주세요.
          </p>
        )}
      </div>
    </div>
  );
}
