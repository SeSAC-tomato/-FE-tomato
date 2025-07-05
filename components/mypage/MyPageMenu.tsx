import Link from "next/link";

export default function MyPageMenu({ userId }: { userId: number }) {
  return (
    <nav className="flex flex-col gap-4 p-4 border rounded-lg min-w-[180px]">
      <Link
        href={`/user/${userId}/profile`}
        className="flex items-center gap-2"
      >
        👤 내 정보
      </Link>
      <Link
        href={`/user/${userId}/password`}
        className="flex items-center gap-2"
      >
        🔒 비밀번호 변경
      </Link>
      <Link
        href={`/user/${userId}/posts/myPosts`}
        className="flex items-center gap-2"
      >
        📄 판매/구매 내역
      </Link>

      <Link href={`/user/${userId}/cart`} className="flex items-center gap-2">
        ❤️ 관심목록
      </Link>
    </nav>
  );
}
