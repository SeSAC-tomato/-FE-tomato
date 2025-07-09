import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface MyPageButtonProps {
  className?: string;
}

const MyPageButton = ({ className }: MyPageButtonProps) => {
  const user = useAuthStore((state) => state.user);
  if (!user?.id) return null;

  return (
    <Link href={`/user/${user.id}/mypage`}>
      <button
        className={`px-4 py-2 bg-gray-200 text-black rounded font-semibold hover:bg-gray-300 hover:scale-105 transition duration-200 cursor-pointer ${className}`}
      >
        마이페이지
      </button>
    </Link>
  );
};

export default MyPageButton;
