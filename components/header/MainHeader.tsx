import Image from "next/image";
import LoginButton from "@/components/button/LoginButton";
import RegisterButton from "@/components/button/RegisterButton";
import LogoutButton from "@/components/button/LogoutButton";
import { useAuthStore } from "@/store/useAuthStore";

const MainHeader = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <header className="w-full flex justify-between items-center px-8 py-6 bg-white/30 backdrop-blur-md shadow-lg fixed top-0 left-0 z-20 border-b border-white/10">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="logo"
          width={48}
          height={48}
          className="drop-shadow-lg"
        />
        <span className="text-3xl font-extrabold text-[#e53935] tracking-tight drop-shadow flex items-center gap-2">
          토마토마켓{" "}
          <span className="text-2xl md:text-2xl mb-2 animate-bounce">🍅</span>
        </span>
      </div>
      <div className="flex gap-3">
        {!isLoggedIn ? (
          <>
            <LoginButton className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all" />
            <RegisterButton className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all" />
          </>
        ) : (
          <LogoutButton className="text-base px-6 py-2 rounded-full shadow hover:scale-105 transition-all" />
        )}
      </div>
    </header>
  );
};

export default MainHeader;
