"use client"

import { PageListProps } from "@/utils/type"

export default function PageList({
  currentPage,
  totalPage,
  onPageListHandle,
}: PageListProps) {
  const pageSize = 10
  const currentGroup = Math.ceil(currentPage / pageSize) - 1
  const startPage = currentGroup * pageSize + 1
  const endPage = Math.min(startPage + pageSize - 1, totalPage)

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )
  return (
    <>
      <div className="h-[28px] flex items-center justify-center text-sm sm:text-base mt-8 mb-8">
        {startPage > 1 && (
          <button onClick={() => onPageListHandle(currentPage - 1)}>
            &laquo;
          </button>
        )}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageListHandle(page)}
            className={`px-3 mx-1 py-1 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPage && (
          <button
            onClick={() => onPageListHandle(endPage + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            &raquo;
          </button>
        )}
      </div>
    </>
  )
}
