import MainHeader from "@/components/header/MainHeader"
import SearchBar from "@/components/search/SearchBar"
import FilterBar from "@/components/filter/FilterBar"
import { PostHeadersProps } from "@/utils/type/post/type"

export default function PostHeader({
  searchKeyword,
  setSearchKeyword,
  productCategory,
  setProductCategory,
  selling,
  setSelling,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  region,
  setRegion,
  dongs,
}: PostHeadersProps) {
  return (
    <>
      <MainHeader>
        <div className="w-full max-w-4xl flex flex-col gap-2 items-center px-4 bg-white/90 shadow-lg rounded-xl py-4">
          <SearchBar value={searchKeyword} onChange={setSearchKeyword} />
          <FilterBar
            {...(searchKeyword && { searchKeyword })}
            {...(setSearchKeyword && { setSearchKeyword })}
            {...(productCategory && { productCategory })}
            {...(setProductCategory && { setProductCategory })}
            {...(region && { region })}
            {...(setRegion && { setRegion })}
            {...(selling !== undefined && { selling })}
            {...(setSelling && { setSelling })}
            {...(minPrice && { minPrice })}
            {...(setMinPrice && { setMinPrice })}
            {...(maxPrice && { maxPrice })}
            {...(setMaxPrice && { setMaxPrice })}
            dongs={dongs}
          />
        </div>
      </MainHeader>
    </>
  )
}
