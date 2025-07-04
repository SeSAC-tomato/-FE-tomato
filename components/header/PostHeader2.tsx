import Button from "../button/Button"
import LogoIcon from "../icons/LogoIcon"
import SearchIcon from "../icons/SearchIcon"
import userImage from "../../public/Vector.png"
import Image from "next/image"

export default function PostHeader2() {
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
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"></div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Image src={userImage} alt="User Profile Icon" />
          <button className="underline underline-offset-6 text-2xl">
            Log Out
          </button>
        </div>
      </div>
    </>
  )
}
