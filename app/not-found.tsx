"use client";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-12 flex flex-col items-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-800 text-lg font-bold mb-2">
          페이지를 찾을 수 없습니다.
        </p>
        <p className="text-gray-500 mb-4">
          요청하신 페이지가 존재하지 않거나, 삭제되었습니다.
        </p>
        <button
          className="mt-2 px-6 py-2 bg-[#e53935] text-white rounded-md font-semibold"
          onClick={() => (window.location.href = "/")}
        >
          메인으로
        </button>
      </div>
    </div>
  );
}
