"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { verify } from "@/utils/api/auth/api";
import VerifyResultCard from "@/components/verify/VerifyResultCard";

export default function EmailVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "fail">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    if (!token || !email) {
      router.replace("/error/bad-request");
      return;
    }
    async function doVerify() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const res = await verify(email ?? "", token ?? "", "EMAIL");
        if (res.status == 200) {
          setStatus("success");
        } else {
          setErrorMsg(res.data?.error?.message || "인증에 실패했습니다.");
          setErrorCode(res.data?.error?.code || "");
          setStatus("fail");
        }
      } catch (e: any) {
        setErrorMsg(
          e?.response?.data?.error?.message || "인증에 실패했습니다."
        );
        setErrorCode(e?.response?.data?.error?.code || "");
        setStatus("fail");
      }
    }
    if (email && token) {
      doVerify();
    }
  }, [token, email]);

  if (!token || !email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-12 flex flex-col items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={48}
          height={48}
          className="mb-2"
        />
        <h2 className="text-2xl font-bold mb-6 text-[#e53935]">이메일 인증</h2>
        {status === "loading" && (
          <VerifyResultCard
            icon={
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e53935] mb-4"></div>
            }
            message="이메일 인증 중입니다..."
            messageClass="text-gray-700"
          />
        )}
        {status === "success" && (
          <VerifyResultCard
            icon={<div className="text-5xl mb-4">✅</div>}
            message="이메일 인증이 완료되었습니다!"
            messageClass="text-green-600"
            buttonText="로그인 하러 가기"
            buttonColorClass="bg-[#e53935]"
            onButtonClick={() => router.push("/login")}
          />
        )}
        {status === "fail" && errorCode === "TOMATO_AUTH_013" && (
          <VerifyResultCard
            icon={<div className="text-5xl mb-4">✅</div>}
            message="이미 인증된 사용자입니다."
            messageClass="text-green-600"
            buttonText="로그인 하러 가기"
            buttonColorClass="bg-[#e53935]"
            onButtonClick={() => router.push("/login")}
          />
        )}
        {status === "fail" && errorCode !== "TOMATO_AUTH_013" && (
          <VerifyResultCard
            icon={<div className="text-5xl mb-4">❌</div>}
            message={errorMsg || "유효하지 않은 인증 링크입니다."}
            messageClass="text-red-500"
            buttonText="메인으로"
            buttonColorClass="bg-gray-400"
            onButtonClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
}
