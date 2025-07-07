"use client";
import { use, useEffect, useState } from "react";
import { getMyPosts } from "@/utils/api/user/api";
import MyPostCard from "@/components/PostCard/MyPostCard";
import { Post, PostsResponse } from "@/utils/type/mypage/type";
import { useAuthStore } from "@/store/useAuthStore";
import MainHeader from "@/components/header/MainHeader";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import PageList from "@/components/PageList/PageList";

interface Params {
  userId: string;
}

export default function MyPostsPage({ params }: { params: Promise<Params> }) {
  const { userId } = use(params);
  const [postsData, setPostsData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"selling" | "end">("selling");
  const [sellingPage, setSellingPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!accessToken) {
          setError("로그인이 필요합니다.");
          return;
        }
        if (user && user.id !== Number(userId)) {
          setError("자신의 게시글만 조회할 수 있습니다.");
          return;
        }

        const response = await getMyPosts(
          Number(userId),
          sellingPage - 1,
          12,
          endPage - 1,
          12
        );
        const responseData = response.data || response;
        const postsData: PostsResponse = responseData.data || responseData;
        setPostsData(postsData);
      } catch (error: any) {
        if (error.response?.status === 403) {
          setError("접근 권한이 없습니다. 로그인 상태를 확인해주세요.");
        } else if (error.response?.status === 401) {
          setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId, user, accessToken, sellingPage, endPage]);

  if (loading) {
    return (
      <>
        <MainHeader />
        <div className="flex w-full max-w-7xl mx-auto mt-8">
          <MyPageMenu userId={Number(userId)} className="self-start h-fit" />
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-6">내 게시물</h1>
            <div className="text-center text-gray-500">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainHeader />
        <div className="flex w-full max-w-7xl mx-auto mt-8">
          <MyPageMenu userId={Number(userId)} className="self-start h-fit" />
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-6">내 게시물</h1>
            <div className="text-center text-red-500">{error}</div>
          </div>
        </div>
      </>
    );
  }

  if (!postsData) return null;

  const sellingPosts = postsData.sellingPosts?.content || [];
  const endPosts = postsData.endPosts?.content || [];
  const sellingTotalPages = postsData.sellingPosts?.pageMeta.totalPages || 1;
  const endTotalPages = postsData.endPosts?.pageMeta.totalPages || 1;

  return (
    <>
      <MainHeader />
      <div className="flex w-full max-w-7xl mx-auto mt-8">
        <MyPageMenu userId={Number(userId)} className="self-start h-fit" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">판매/구매내역</h1>
          <div className="grid grid-cols-4 gap-6">
            {(tab === "selling" ? sellingPosts : endPosts).length === 0 ? (
              <div className="col-span-4 text-center text-gray-500">
                게시물이 없습니다.
              </div>
            ) : (
              (tab === "selling" ? sellingPosts : endPosts).map((post, idx) => (
                <MyPostCard
                  key={`${post.title}-${post.createdAt}-${idx}`}
                  post={post}
                />
              ))
            )}
          </div>
          {tab === "selling" ? (
            <PageList
              currentPage={sellingPage}
              totalPage={sellingTotalPages}
              onPageListHandle={setSellingPage}
            />
          ) : (
            <PageList
              currentPage={endPage}
              totalPage={endTotalPages}
              onPageListHandle={setEndPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
