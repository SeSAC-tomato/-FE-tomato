"use client";
import { useAuthStore } from "@/store/useAuthStore";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import MainHeader from "@/components/header/MainHeader";

export default function MyPageMain() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null; // 또는 로딩 처리

  return (
    <>
      <MainHeader>
        {/* 중앙 상단에 마이페이지 타이틀 */}
        <div className="w-full flex justify-center mt-12">
          <span className="px-6 py-2 rounded-full bg-gray-200 text-black text-lg font-semibold shadow">
            마이페이지
          </span>
        </div>
        {/* 아래에 메뉴 + 본문 */}
        <div className="flex w-full max-w-4xl mx-auto mt-8">
          <MyPageMenu userId={user.id} />
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mt-8">
              {user.nickname} 님 환영합니다!
            </h2>
          </div>
        </div>
      </MainHeader>
    </>
  );
}
