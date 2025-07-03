"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/posts");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <LoginForm />
    </div>
  );
}
