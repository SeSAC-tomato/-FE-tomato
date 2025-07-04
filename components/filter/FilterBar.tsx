import DropDown from "@/components/dropdown/dropDown";
import React from "react";

interface FilterBarProps {
  category: string | null;
  setCategory: (v: string | null) => void;
  region: string | null;
  setRegion: (v: string | null) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (v: boolean) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  className?: string;
}

const categories = [
  "디지털 기기",
  "생활가전",
  "가구/인테리어",
  "생활/주방",
  "유아동",
];
const regions = ["문래동", "구로동", "대림동", "가산동"];

const FilterBar: React.FC<FilterBarProps> = ({
  category,
  setCategory,
  region,
  setRegion,
  onlyAvailable,
  setOnlyAvailable,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  className = "",
}) => (
  <div
    className={`flex flex-wrap gap-2 w-full md:w-auto items-center ${className}`}
  >
    <DropDown
      buttonText={category || "카테고리"}
      items={categories}
      onSelect={setCategory}
    />
    <DropDown
      buttonText={region || "지역"}
      items={regions}
      onSelect={setRegion}
    />
    <button
      className={`px-4 py-2 rounded-md font-semibold border ${
        onlyAvailable ? "bg-[#e53935] text-white" : "bg-white text-gray-700"
      } transition`}
      onClick={() => setOnlyAvailable(!onlyAvailable)}
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
        className="w-20 px-2 py-1 border rounded"
      />
      <span>~</span>
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="최대가격"
        className="w-20 px-2 py-1 border rounded"
      />
    </div>
  </div>
);

export default FilterBar;
