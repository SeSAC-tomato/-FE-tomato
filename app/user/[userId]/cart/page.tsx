"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "@/components/header/MainHeader";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import { useAuthStore } from "@/store/useAuthStore";

export default function CartPage({ params }: { params: { userId: string } }) {
  const [items, setItems] = useState<any[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    axios
      .get(`/api/v1/user/${params.userId}/cart`)
      .then((res) => setItems(res.data));
  }, [params.userId]);

  if (!user) return null;

  return (
    <>
      <MainHeader>
        {/* 중앙 상단에 관심목록 타이틀 */}
        <div className="w-full flex justify-center mt-12">
          <span className="px-6 py-2 rounded-full bg-gray-200 text-black text-lg font-semibold shadow">
            관심목록
          </span>
        </div>
        {/* 아래에 메뉴 + 본문 */}
        <div className="flex w-full max-w-4xl mx-auto mt-8">
          <MyPageMenu userId={user.id} />
          <div className="flex-1 flex flex-col items-center justify-center">
            {items.length === 0 ? (
              <p>관심목록이 비어 있습니다.</p>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <p>{item.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </MainHeader>
    </>
  );
}
