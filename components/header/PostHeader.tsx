import MainHeader from "@/components/header/MainHeader"
import SearchBar from "@/components/search/SearchBar"
import FilterBar from "@/components/filter/FilterBar"
import { useState } from "react"

const PostHeader = () => {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [region, setRegion] = useState<string | null>(null)
  const [postStatus, setPostStatus] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  return (
    <>
      <MainHeader>
        <div className="w-full max-w-4xl flex flex-col gap-2 items-center px-4 bg-white/90 shadow-lg rounded-xl py-4">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            category={category}
            setCategory={setCategory}
            region={region}
            setRegion={setRegion}
            postStatus={postStatus}
            setPostStatus={setPostStatus}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </div>
      </MainHeader>
    </>
  )
}

export default PostHeader
