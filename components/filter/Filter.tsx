import { useState } from "react"
import DropDown from "../dropdown/dropDown"
const categories: string[] = [
  "디지털 기기",
  "생활가전",
  "가구/인테리어",
  "생활/주방",
  "유아동",
]

const regions: string[] = ["문래동", "구로동", "대림동", "가산동"]

export default function Filter() {
  const categoriesDropDown: string[] = ["모든 카테고리", ...categories]
  const regionsDropDown: string[] = ["모든 지역", ...regions]

  const [category, setCategory] = useState<string | null>("모든 카테고리")
  const [region, setRegion] = useState<string | null>("모든 지역")

  const onSelectCategory = (item: string) => {
    if (item === "모든 카테고리") {
      setCategory(null)
    } else {
      setCategory(item)
    }
  }

  const onSelectRegion = (item: string) => {
    if (item === "모든 지역") {
      setRegion(null)
    } else {
      setRegion(item)
    }
  }

  return (
    <>
      <div className="mt-[3.71vh] h-[145px] w-full bg-gray-100 flex items-start justify-around">
        <div className="flex-1 flex-col hidden md:flex items-start p-2 rounded-md text-center flex items-center justify-center">
          <div>필터</div>
          <div>
            <button>거래가능만 검색</button>
          </div>
        </div>
        <div className="flex-1 mt-2 p-2 rounded-md text-center flex items-center justify-center">
          <DropDown
            buttonText={"카테고리"}
            items={categories}
            onSelect={onSelectCategory}
          />
        </div>
        <div className="flex-1 mt-2 p-2 rounded-md text-center flex items-center justify-center">
          <DropDown
            buttonText={"위치 설정"}
            items={regions}
            onSelect={onSelectRegion}
          />
        </div>
        <div className="flex-1 mt-2 p-2 rounded-md text-center flex items-center justify-center">
          <div>가격</div>
        </div>
      </div>
    </>
  )
}
