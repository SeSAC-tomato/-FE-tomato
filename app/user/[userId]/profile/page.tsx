"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import MyPageMenu from "@/components/mypage/MyPageMenu";
import MainHeader from "@/components/header/MainHeader";
import { checkNicknameDuplicate } from "@/utils/api/auth/api";
import api from "@/utils/api/axios";
import { updateUserProfile } from "@/utils/api/user/api";

// 카카오 window 타입 보강
declare global {
  interface Window {
    daum: any;
  }
}

export default function UserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [editField, setEditField] = useState<"nickname" | "address" | null>(
    null
  );
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [address, setAddress] = useState(user?.address || "");
  const [nicknameChecked, setNicknameChecked] = useState(false); // 닉네임 중복확인 통과 여부
  const [nicknameCheckedValue, setNicknameCheckedValue] = useState(""); // 마지막으로 중복확인 통과한 닉네임
  const [addressTemp, setAddressTemp] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    address: user?.address || "",
    sido: "",
    sigungu: "",
    dong: "",
    x: "",
    y: "",
  });

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
        handleAddressSelect(data);
      },
    }).open();
  };

  const handleAddressSelect = (data) => {
    const address = data.address || data.roadAddress || data.jibunAddress;
    setAddressTemp(address);
    setAddressInfo({
      address,
      sido: data.sido,
      sigungu: data.sigungu,
      dong: data.bname,
      x: "", // 좌표는 빈 값
      y: "", // 좌표는 빈 값
    });
    setEditField("address");
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
  const isAddressChanged = addressTemp !== user?.address && addressTemp !== "";
  const canApply = isNicknameChanged || isAddressChanged;

  // 적용 버튼 클릭
  const handleApply = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(
        user.id,
        isNicknameChanged ? nicknameCheckedValue : user.nickname,
        addressInfo.address,
        addressInfo.sido,
        addressInfo.sigungu,
        addressInfo.dong,
        Number(addressInfo.x),
        Number(addressInfo.y)
      );
      // zustand user 정보 갱신
      setUser({
        ...user,
        nickname: isNicknameChanged ? nicknameCheckedValue : user.nickname,
        address: addressInfo.address, // ← addressTemp 대신 addressInfo.address 사용 권장
      });
      // **로컬 상태도 모두 최신값으로 동기화**
      setAddress(addressInfo.address);
      setAddressTemp(addressInfo.address);
      setAddressInfo((prev) => ({
        ...prev,
        address: addressInfo.address,
      }));
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

  const handleProfileUpdate = () => {
    api.put("/user/profile", {
      ...otherFields,
      x: addressInfo.x, // ← 0이 아닌 실제 값이어야 함
      y: addressInfo.y,
    });
  };

  if (!user) return null;

  return (
    <>
      <MainHeader />
      <div className="w-full flex justify-center mt-12">
        <h1 className="text-2xl font-bold text-center my-8">내 정보</h1>
      </div>
      <div className="flex w-full max-w-4xl mx-auto mt-8">
        <MyPageMenu userId={user.id} className="self-start h-fit" />
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
                  onChange={(e) => {
                    setAddressTemp(e.target.value);
                    setAddressInfo((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                  }}
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
                  : loading || !canApply
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
              }
            `}
            onClick={handleApply}
            disabled={loading || !canApply}
          >
            {loading ? "적용 중..." : "적용"}
          </button>
        </div>
      </div>
    </>
  );
}
