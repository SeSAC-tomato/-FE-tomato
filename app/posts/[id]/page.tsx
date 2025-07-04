"use client";
import MainHeader from "@/components/header/MainHeader";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import productImage from "../../../public/제품이미지.png";
import { PostPageProps } from "@/utils/type/type";

export default function Post({ params }: PostPageProps) {
  // 더미 데이터
  const post = {
    title: "아이패드 9세대 64GB",
    category: "디지털 기기",
    updatedAt: "3시간 전",
    price: "240,000원",
    description: `사용한지 2년 됐습니다.\n케이스랑 펜슬, 키보드도 같이 드립니다.\n본문의 내용이 아주 길어질수도 있을 경우에 대비하여 스크롤을 구성한 대비의 화면입니다.`,
    user: {
      name: "유정우",
      region: "대림동",
      avatar: "https://via.placeholder.com/48x48.png?text=U",
    },
    status: "판매중",
  };

  const [postContent, setPostContent] = useState(`사용한지 2년 됐습니다. 
    케이스랑 펜슬, 키보드도 같이 드립니다. 
    본문의 내용이 아주 길어질수도 있을 경우에 대비하여 스크롤을
    구성한 대비의 화면입니다. 수정, 삭제 버튼은 고정 위치에 있으며
    전체 스크롤이 올라와도 언제나 하단에 고정되어 위치합니다.
    아래의 내용도 투명하게 보입니다.

    이것은 추가적인 내용입니다.
    엔터 키를 여러 번 눌러 줄 바꿈을 해보세요.
    그리고 띄어쓰기도 그대로 유지됩니다.
    
    텍스트가 길어지면 스크롤이 나타나게 됩니다.
    길이를 길게 표현합니다`);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  // 카드 너비에 맞춰 버튼바 중앙정렬
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  useEffect(() => {
    function updateWidth() {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const openModal = (type: "edit" | "delete") => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const handleConfirm = () => {
    // 실제 수정/삭제 처리
    if (modalType === "edit") {
      setResultMessage("수정이 완료되었습니다.");
    } else if (modalType === "delete") {
      setResultMessage("삭제가 완료되었습니다.");
    }

    closeModal();
    setResultModalOpen(true);
  };

  const closeResultModal = () => {
    setResultModalOpen(false);
  };

  return (
    <>
      <MainHeader />
      {/* 카드/내용 영역만 스크롤, 전체는 overflow-hidden */}
      <div className="fixed inset-0 pt-[80px] overflow-y-auto hide-scrollbar flex flex-col items-center justify-center min-h-screen">
        {/* 네비게이션 뎁스(Breadcrumbs) - 카드 외부(카드 위, 배경 위) */}
        <div className="w-full max-w-5xl flex justify-start mb-6 text-sm text-gray-500 items-center gap-0 pl-0">
          <Link
            href="/"
            className="hover:underline hover:text-[#e53935] transition"
          >
            홈
          </Link>
          <span className="px-1">&gt;</span>
          <Link
            href="/posts"
            className="hover:underline hover:text-[#e53935] transition"
          >
            중고거래
          </Link>
          <span className="px-1">&gt;</span>
          <Link
            href={`/posts?category=${encodeURIComponent(post.category)}`}
            className="hover:underline hover:text-[#e53935] transition"
          >
            {post.category}
          </Link>
          <span className="px-1">&gt;</span>
          <span className="text-gray-800 font-bold">{post.title}</span>
        </div>
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl px-12 py-10 flex flex-col gap-8">
          {/* 상단: 사진+설명 */}
          <div className="flex flex-row gap-10 w-full">
            {/* 사진 */}
            <div className="flex-1 flex flex-col items-center justify-start">
              <div className="w-full max-w-md bg-gray-300 rounded-xl flex items-center justify-center h-full">
                <Image
                  src={productImage}
                  alt="제품 이미지"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>
            {/* 설명+정보 */}
            <div className="flex-1 flex flex-col justify-start">
              {/* 설명 위 정보 */}
              <div className="w-full max-w-md mx-auto mb-4">
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  {post.title}
                  {post.status === "예약" && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      예약
                    </span>
                  )}
                  {post.status === "판매중" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                      판매중
                    </span>
                  )}
                  {post.status === "판매완료" && (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                      판매완료
                    </span>
                  )}
                </h2>
                <div className="text-gray-500 text-base mb-1">
                  {post.category} · {post.updatedAt}
                </div>
                <div className="text-xl font-bold mb-4">{post.price}</div>
              </div>
              {/* 설명 박스 (사진과 같은 크기, 내부 스크롤) */}
              <div className="w-full max-w-md h-90 bg-gray-200 rounded-xl p-5 text-gray-700 text-base whitespace-pre-line overflow-y-auto mx-auto hide-scrollbar">
                {postContent}
              </div>
            </div>
          </div>
          {/* 하단: 사용자+버튼 */}
          <div className="flex flex-row items-center justify-between gap-6 mt-4 w-full">
            {/* 사용자 정보 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                <Image
                  src={post.user.avatar}
                  alt="프로필"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <div className="font-bold text-lg">{post.user.name}</div>
                <div className="text-gray-500 text-sm">{post.user.region}</div>
              </div>
            </div>
            {/* 버튼 그룹 (오른쪽 하단, 같은 라인) */}
            <div className="flex gap-4 justify-end">
              <button className="px-6 py-2 rounded-full bg-[#ffe066] text-[#222] font-bold text-base shadow hover:bg-[#ffd600] transition">
                채팅
              </button>
              <button className="px-6 py-2 rounded-full bg-[#ff4fcf] text-white font-bold text-base shadow hover:bg-[#e040fb] transition">
                찜하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
