import SearchIcon from "@/components/icons/SearchIcon";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  className = "",
}) => (
  <div className={`flex items-center w-full relative ${className}`}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="검색어를 입력하세요"
      className="w-full h-12 pl-12 pr-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#e53935] focus:outline-none text-base"
    />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      <SearchIcon />
    </span>
  </div>
);

export default SearchBar;
