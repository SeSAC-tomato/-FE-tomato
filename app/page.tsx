"use client";

import dynamic from "next/dynamic";

const MainPageContent = dynamic(() => import("@/components/MainPageContent"), {
  ssr: false,
});

export default function MainPage() {
  return <MainPageContent />;
}
