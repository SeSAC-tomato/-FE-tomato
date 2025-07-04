import React from "react";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  className = "",
  style,
  children,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 hover:scale-105 transition duration-200 cursor-pointer ${className}`}
      style={style}
    >
      {children ?? "로그인"}
    </button>
  );
};

export default LoginButton;
