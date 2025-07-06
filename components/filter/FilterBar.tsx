import DropDown from "@/components/dropdown/dropDown"
import React from "react"

interface FilterBarProps {
  category: string | null
  setCategory: (v: string | null) => void
  region: string | null
  setRegion: (v: string | null) => void
  postStatus: boolean
  setPostStatus: (v: boolean) => void
  minPrice: string
  setMinPrice: (v: string) => void
  maxPrice: string
  setMaxPrice: (v: string) => void
  className?: string
}

const categories = [
  "디지털 기기",
  "생활가전",
  "가구/인테리어",
  "생활/주방",
  "유아동",
]
const regions = ["문래동", "구로동", "대림동", "가산동"]

const FilterBar: React.FC<FilterBarProps> = ({
  category,
  setCategory,
  region,
  setRegion,
  postStatus,
  setPostStatus,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  className = "",
}) => (
  <div
    className={`w-full bg-white/50 rounded-xl flex flex-wrap md:flex-nowrap gap-3 px-4 py-3 items-center justify-between ${className}`}
  >
    <div className="flex gap-2 flex-1 min-w-0">
      <DropDown
        buttonText={category || "카테고리"}
        items={categories}
        onSelect={setCategory}
        className="bg-gray-100 focus:bg-gray-200 rounded-md shadow-none border-none"
      />
      <DropDown
        buttonText={region || "지역"}
        items={regions}
        onSelect={setRegion}
        className="bg-gray-100 focus:bg-gray-200 rounded-md shadow-none border-none"
      />
    </div>
    <button
      className={`px-4 py-2 rounded-md font-semibold transition h-12 min-w-[110px] shadow-none border-none focus:outline-none ${
        postStatus
          ? "bg-[#e53935] text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setPostStatus(!postStatus)}
      type="button"
    >
      거래가능만
    </button>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="최소가격"
        className="w-20 px-2 py-2 rounded h-12 text-base bg-gray-100 focus:bg-gray-200 border-none shadow-none focus:outline-none"
      />
      <span className="text-gray-400">~</span>
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="최대가격"
        className="w-20 px-2 py-2 rounded h-12 text-base bg-gray-100 focus:bg-gray-200 border-none shadow-none focus:outline-none"
      />
    </div>
  </div>
)

export default FilterBar
