import Image from "next/image";
import LoginButton from "@/components/button/LoginButton";
import RegisterButton from "@/components/button/RegisterButton";
import LogoutButton from "@/components/button/LogoutButton";
import {useAuthStore} from "@/store/useAuthStore";
import {useRouter} from "next/navigation";
import React from "react";

const MainHeader = ({children}: { children?: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const router = useRouter();

    return (
        <>
            <header
                className="w-full flex justify-between items-center px-8 py-6 bg-white/30 backdrop-blur-md shadow-lg fixed top-0 left-0 z-20 border-b border-white/10">
                <button
                    className="flex items-center gap-3 focus:outline-none cursor-pointer"
                    onClick={() => router.push("/")}
                    aria-label="메인으로 이동"
                    type="button"
                >
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        width={48}
                        height={48}
                        className="drop-shadow-lg"
                    />
                    <span
                        className="text-3xl font-extrabold text-[#e53935] tracking-tight drop-shadow flex items-center gap-2">
            토마토마켓{" "}
                        <span className="text-2xl md:text-2xl mb-2 animate-bounce">🍅</span>
          </span>
                </button>
                <div className="flex gap-3">
                    {!isLoggedIn ? (
                        <>
                            <LoginButton
                                className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all"/>
                            <RegisterButton
                                className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all"/>
                        </>
                    ) : (
                        <>
                            <LogoutButton
                                className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all"/>

                            <button
                                onClick={() => router.push('/chat')}
                                className={`px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 hover:scale-105 transition duration-200 cursor-pointer text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all`}
                            >
                                채팅
                            </button>
                        </>


                    )}
                </div>
            </header>
            <div className="pt-32 pb-4 w-full flex flex-col items-center">
                {children}
            </div>
        </>
    );
};

export default MainHeader;
