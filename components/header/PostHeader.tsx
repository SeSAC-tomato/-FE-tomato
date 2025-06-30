import Button from "../button/Button"
import LogoIcon from "../icons/LogoIcon"
import SearchIcon from "../icons/SearchIcon"

export default function PostHeader() {
  return (
    <>
      <div className="mt-[5.57vh] h-[82px] flex items-center justify-between font-bold text-xl">
        <div className="w-1/10 pl-5">
          <LogoIcon />
        </div>
        <div className="relative w-6/10 h-10 hidden md:flex">
          <input
            type="text"
            className="w-full h-10 border border-gray-300 rounded-md"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <SearchIcon />
          </div>
        </div>
        <div className="flex flex-col justify-center 3/10">
          <Button children="로그인" />
          <Button children="회원가입" />
        </div>
      </div>
    </>
  )
}
