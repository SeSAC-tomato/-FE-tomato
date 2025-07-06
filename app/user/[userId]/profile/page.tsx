"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import MainHeader from "@/components/header/MainHeader";
import { checkNicknameDuplicate } from "@/utils/api/auth/api";
import api from "@/utils/api/axios";

// 카카오 window 타입 보강
declare global {
  interface Window {
    daum: any;
  }
}

export default function UserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [editField, setEditField] = useState<"nickname" | "address" | null>(
    null
  );
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [address, setAddress] = useState(user?.address || "");
  const [nicknameChecked, setNicknameChecked] = useState(false); // 닉네임 중복확인 통과 여부
  const [nicknameCheckedValue, setNicknameCheckedValue] = useState(""); // 마지막으로 중복확인 통과한 닉네임
  const [addressTemp, setAddressTemp] = useState(user?.address || ""); // 주소지 임시값
  const [loading, setLoading] = useState(false);

  // 카카오 주소 검색 스크립트 동적 로드
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.daum && window.daum.Postcode) return;
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 닉네임 중복확인
  const handleCheckNickname = async () => {
    if (!nickname) return alert("닉네임을 입력하세요");
    try {
      const data = await checkNicknameDuplicate(nickname);
      if (data.data) {
        alert(data.data.message);
        if (!data.data.duplication) {
          setNicknameChecked(true);
          setNicknameCheckedValue(nickname);
        } else {
          setNicknameChecked(false);
          setNicknameCheckedValue("");
        }
      } else {
        alert("중복 여부를 확인할 수 없습니다.");
        setNicknameChecked(false);
        setNicknameCheckedValue("");
      }
    } catch {
      alert("오류가 발생했습니다.");
      setNicknameChecked(false);
      setNicknameCheckedValue("");
    }
  };

  // 카카오 주소 검색
  const handleSearchAddress = () => {
    if (typeof window === "undefined" || !window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setAddressTemp(data.address);
      },
    }).open();
  };

  // 닉네임 변경 시작
  const handleEditNickname = () => {
    setEditField("nickname");
    setNickname(user?.nickname || "");
    setNicknameChecked(false);
    setNicknameCheckedValue("");
  };

  // 닉네임 취소
  const handleCancelNickname = () => {
    setEditField(null);
    setNickname(user?.nickname || "");
    setNicknameChecked(false);
    setNicknameCheckedValue("");
  };

  // 주소지 변경 시작
  const handleEditAddress = () => {
    setEditField("address");
    setAddressTemp(user?.address || "");
  };

  // 주소지 취소
  const handleCancelAddress = () => {
    setEditField(null);
    setAddressTemp(user?.address || "");
  };

  // 적용 버튼 활성화 조건
  const isNicknameChanged =
    nicknameChecked &&
    nicknameCheckedValue !== "" &&
    nicknameCheckedValue !== user?.nickname;
  const isAddressChanged =
    editField === null && addressTemp !== user?.address && addressTemp !== "";
  const canApply =
    isNicknameChanged ||
    (editField === null && addressTemp !== user?.address && addressTemp !== "");

  // 적용 버튼 클릭
  const handleApply = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.put(`/user/${user.id}/profile`, {
        nickname: isNicknameChanged ? nicknameCheckedValue : user.nickname,
        address:
          editField === null &&
          addressTemp !== user.address &&
          addressTemp !== ""
            ? addressTemp
            : user.address,
      });
      alert("적용되었습니다!");
      // 적용 후 상태 초기화
      setEditField(null);
      setNicknameChecked(false);
      setNicknameCheckedValue("");
    } catch (e) {
      alert("수정 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <MainHeader />
      <div className="w-full flex justify-center mt-12">
        <span className="px-6 py-2 rounded-full bg-gray-200 text-black text-lg font-semibold shadow">
          내 정보
        </span>
      </div>
      <div className="flex w-full max-w-4xl mx-auto mt-8">
        <MyPageMenu userId={user.id} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">
            {user.nickname} 님의 프로필
          </h2>
          {/* 닉네임 */}
          <div className="mb-2 flex items-center gap-2">
            <strong>닉네임:</strong>
            {editField === "nickname" ? (
              <>
                <input
                  className="border rounded px-2 py-1"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameChecked(false);
                    setNicknameCheckedValue("");
                  }}
                />
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  onClick={handleCancelNickname}
                >
                  취소
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  onClick={handleCheckNickname}
                  disabled={nickname === user.nickname || !nickname}
                >
                  중복확인
                </button>
              </>
            ) : (
              <>
                <span>{user.nickname}</span>
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  onClick={handleEditNickname}
                >
                  변경
                </button>
              </>
            )}
          </div>
          {/* 주소지 */}
          <div className="mb-2 flex items-center gap-2">
            <strong>주소지:</strong>
            {editField === "address" ? (
              <>
                <input
                  className="border rounded px-2 py-1"
                  value={addressTemp}
                  onChange={(e) => setAddressTemp(e.target.value)}
                />
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  onClick={handleSearchAddress}
                >
                  주소 검색
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  onClick={handleCancelAddress}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span>{user.address}</span>
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  onClick={handleEditAddress}
                >
                  변경
                </button>
              </>
            )}
          </div>
          <p className="mb-2">
            <strong>아이디:</strong> {user.email}
          </p>
          {/* 적용 버튼 */}
          <button
            className={`mt-8 px-6 py-2 rounded-full font-semibold shadow transition-colors
              ${
                loading
                  ? "bg-gray-200 text-black"
                  : loading ||
                    (!isNicknameChanged && addressTemp === user.address) ||
                    (isNicknameChanged && !nicknameChecked)
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
              }
            `}
            onClick={handleApply}
            disabled={
              loading ||
              (!isNicknameChanged && addressTemp === user.address) ||
              (isNicknameChanged && !nicknameChecked)
            }
          >
            {loading ? "적용 중..." : "적용"}
          </button>
        </div>
      </div>
    </>
  );
}
