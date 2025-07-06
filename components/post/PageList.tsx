"use client"
import { PageListProps } from "@/utils/type/post/type"

export default function PageList({
  currentPage,
  totalPages,
  onPageListHandle,
}: PageListProps) {
  const pageSize = 10
  const currentGroup = Math.floor(currentPage / pageSize)
  const startPage = currentGroup * pageSize + 1
  const endPage = Math.min(startPage + pageSize - 1, totalPages)

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  return (
    <div className="h-[28px] flex items-center justify-center text-sm sm:text-base mt-8 mb-8">
      {startPage > 1 && (
        <button
          onClick={() => onPageListHandle(startPage - 1)} // 이전 그룹의 마지막 페이지(1-based)
          className="px-3 py-1 rounded hover:bg-gray-300 transition"
          aria-label="Previous Page"
        >
          &laquo;
        </button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageListHandle(page)} // 1-based 페이지 번호 그대로 넘김
          className={`px-3 mx-1 py-1 rounded transition
            ${
              page === currentPage + 1
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white"
            }
          `}
          aria-current={page === currentPage + 1 ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <button
          onClick={() => onPageListHandle(endPage + 1)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
          aria-label="Next Page"
        >
          &raquo;
        </button>
      )}
    </div>
  )
}
