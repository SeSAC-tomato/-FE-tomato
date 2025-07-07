"use client";
import { useEffect, useState, use } from "react";
import { getCartItems } from "@/utils/api/user/api";
import MainHeader from "@/components/header/MainHeader";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import PageList from "@/components/post/PageList";
import { useAuthStore } from "@/store/useAuthStore";
import { CartPost, CartResponse } from "@/utils/type/mypage/type";
import CartPostCard from "@/components/PostCard/CartPostCard";
import { removeFromCart } from "@/app/user/[userId]/cart/delete";

export default function CartPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [page, setPage] = useState(1);
  const user = useAuthStore((state) => state.user);
  const [likeSort, setLikeSort] = useState<
    "LIKE_CREATED_AT" | "POST_CREATED_AT" | "PRICE" | "POPULARITY"
  >("LIKE_CREATED_AT");

  useEffect(() => {
    getCartItems(Number(userId), page - 1, 12, likeSort).then((res) => {
      console.log("카트 API 응답:", res);
      const data: CartResponse = res.data?.data || res.data || res;
      setCartData(data);
    });
  }, [userId, page, likeSort]);

  if (!user) return null;
  if (!cartData) return null;

  return (
    <>
      <MainHeader />
      <div className="flex w-full max-w-7xl mx-auto mt-8">
        <MyPageMenu userId={user.id} className="self-start h-fit" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">관심목록</h1>
          <div className="flex justify-end mb-4">
            <select
              value={likeSort}
              onChange={(e) => {
                setLikeSort(e.target.value as any);
                setPage(1);
              }}
              className="px-3 py-2 border rounded"
            >
              <option value="LIKE_CREATED_AT">찜한순</option>
              <option value="POST_CREATED_AT">최신순</option>
              <option value="PRICE">가격순</option>
              <option value="POPULARITY">인기순</option>
            </select>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {cartData.content && cartData.content.length === 0 ? (
              <div className="col-span-4 text-center text-gray-500">
                관심목록이 비어 있습니다.
              </div>
            ) : (
              cartData.content &&
              cartData.content.map((post, idx) => (
                <CartPostCard
                  key={`${post.title}-${post.createdAt}-${idx}`}
                  post={post}
                  onUnlike={async () => {
                    await removeFromCart(user.id, post.postId);
                    setCartData((prev) =>
                      prev
                        ? {
                            ...prev,
                            content: prev.content.filter(
                              (p) => p.postId !== post.postId
                            ),
                          }
                        : prev
                    );
                  }}
                />
              ))
            )}
          </div>
          <PageList
            currentPage={cartData.currentPage + 1}
            totalPage={cartData.totalPages}
            onPageListHandle={setPage}
          />
        </div>
      </div>
    </>
  );
}
