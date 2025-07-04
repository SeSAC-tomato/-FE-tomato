"use client";

export default function BadRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-12 flex flex-col items-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-yellow-600 text-lg font-bold mb-2">
          잘못된 요청입니다.
        </p>
        <p className="text-gray-500 mb-4">
          요청이 올바르지 않거나, 파라미터가 누락되었습니다.
        </p>
        <button
          className="mt-2 px-6 py-2 bg-gray-400 text-white rounded-md font-semibold"
          onClick={() => (window.location.href = "/")}
        >
          메인으로
        </button>
      </div>
    </div>
  );
}
