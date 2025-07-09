"use client"
import DropDown from "@/components/dropdown/dropDown"
import {
  categoryEnumToLabelMap,
  PostStatus,
  ProductCategory,
} from "@/utils/domain/label"
import React, { useEffect, useState } from "react"

interface FilterBarProps {
  productCategory?: string | undefined
  setProductCategory?: (v: ProductCategory | undefined) => void
  region?: string | undefined
  setRegion?: (v: string) => void
  selling?: boolean
  setSelling?: (v: boolean) => void
  minPrice?: string
  setMinPrice?: (v: string) => void
  maxPrice?: string
  setMaxPrice?: (v: string) => void
  className?: string
  dongs: string[]
}

export const categoryLabelMap: Record<string, ProductCategory> = {
  "디지털 기기": "DIGITAL_DEVICE",
  생활가전: "HOME_APPLIANCE",
  "가구/인테리어": "FURNITURE",
  "생활/주방": "KITCHEN",
  유아동: "KIDS",
}

const FilterBar: React.FC<FilterBarProps> = ({
  productCategory,
  setProductCategory,
  region,
  setRegion,
  selling,
  setSelling,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  dongs,
  className = "",
}) => {
  return (
    <div
      className={`w-full bg-white/50 rounded-xl flex flex-wrap md:flex-nowrap gap-3 px-4 py-3 items-center justify-between ${className}`}
    >
      <div className="flex gap-2 flex-1 min-w-0">
        {setProductCategory && (
          <DropDown
            buttonText={
              productCategory
                ? categoryEnumToLabelMap[productCategory as ProductCategory]
                : "카테고리"
            }
            items={Object.keys(categoryLabelMap)}
            onSelect={(label: string) => {
              const selected = categoryLabelMap[label]
              if (selected) setProductCategory(selected)
            }}
            className="bg-gray-100 focus:bg-gray-200 rounded-md shadow-none border-none"
          />
        )}
        {setRegion && (
          <DropDown
            buttonText={"지역"}
            items={dongs}
            onSelect={(region) => setRegion(region)}
            className="bg-gray-100 focus:bg-gray-200 rounded-md shadow-none border-none"
          />
        )}
      </div>

      {setSelling && (
        <button
          className={`px-4 py-2 rounded-md font-semibold transition h-12 min-w-[110px] shadow-none border-none focus:outline-none ${
            selling
              ? "bg-[#e53935] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelling(!selling)}
          type="button"
        >
          거래가능만
        </button>
      )}

      <div className="flex items-center gap-1">
        {setMinPrice && (
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="최소가격"
            className="w-20 px-2 py-2 rounded h-12 text-base bg-gray-100 focus:bg-gray-200 border-none shadow-none focus:outline-none"
          />
        )}
        <span className="text-gray-400">~</span>
        {setMaxPrice && (
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="최대가격"
            className="w-20 px-2 py-2 rounded h-12 text-base bg-gray-100 focus:bg-gray-200 border-none shadow-none focus:outline-none"
          />
        )}
      </div>
    </div>
  )
}

export default FilterBar
