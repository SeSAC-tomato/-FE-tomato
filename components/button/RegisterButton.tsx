import React from "react";
import { useRouter } from "next/navigation";

interface RegisterButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  className = "",
  style,
  children,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/register");
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 hover:scale-105 transition duration-200 cursor-pointer ${className}`}
      style={style}
    >
      {children ?? "회원가입"}
    </button>
  );
};

export default RegisterButton;
