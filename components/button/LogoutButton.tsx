import React from "react";
import { logout as apiLogout } from "@/utils/api/auth/api";
import { useAuthStore } from "@/store/useAuthStore";

interface LogoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  style,
}) => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await apiLogout();
      logout(); // 전역 상태 로그아웃
      alert("로그아웃 되었습니다.");
    } catch (e) {
      alert("로그아웃 실패");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-gray-200 text-black rounded font-semibold hover:bg-gray-300 hover:scale-105 transition duration-200 cursor-pointer ${className}`}
      style={style}
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
