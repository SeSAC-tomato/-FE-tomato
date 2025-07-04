import { refreshToken } from "@/utils/api/auth/api";

export default function RefreshTestButton() {
  const handleRefresh = async () => {
    try {
      const res = await refreshToken();
      console.log(res);
      
      const newAccessToken = res.headers["authorization"];
      alert("새 accessToken: " + newAccessToken);
    } catch (err: any) {
      alert("리프레시 실패: " + (err.message || "에러"));
    }
  };

  return (
    <button
      className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={handleRefresh}
    >
      accessToken 리프레시 테스트
    </button>
  );
}
