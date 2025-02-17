"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarClose, SidebarOpen } from "lucide-react";

import SidebarContent from "@/components/sidebar/SidebarContent";
import SidebarContentMobile from "@/components/sidebar/SidebarContentMobile";

const MobileSideBar = ({ pathname }: { pathname: string }) => {
  const [mobileHide, setMobileHide] = useState(true);

  const handleToggle = () => {
    setMobileHide(!mobileHide);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex rounded-none transition-all duration-150 md:hidden ${mobileHide ? "w-0 bg-transparent delay-100" : "w-screen bg-[#18181B] bg-opacity-60"} `}
    >
      <div
        className={`relative flex flex-col transition-all duration-300 ${mobileHide ? "min-w-[40px] bg-transparent" : "w-[258px] bg-[#18181B]"}`}
      >
        <div
          className={`absolute ${mobileHide ? "left-[24px]" : "left-[208px]"} top-[16px] z-20 flex w-10 items-center justify-center md:hidden`}
        >
          <button
            onClick={handleToggle}
            className="flex h-[40px] w-[40px] items-center justify-center"
          >
            {mobileHide ? (
              <SidebarOpen className="h-[32px] w-[32px] text-white" />
            ) : (
              <SidebarClose className="h-[32px] w-[32px] text-white" />
            )}
          </button>
        </div>
        {!mobileHide && (
          <div className="flex h-full w-full flex-col">
            <div
              className={`flex h-[80px] w-full items-center border-b border-white/10 px-[32px]`}
            >
              <h2 className="select-none text-nowrap">PDF Uploader</h2>
            </div>
            <SidebarContentMobile
              hide={mobileHide}
              pathname={pathname}
              handleToggle={handleToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function SideBar() {
  const pathname = usePathname();
  const [hide, setHide] = useState(false);
  const handleToggle = () => {
    setHide(!hide);
  };

  return (
    <div
      className={`relative flex h-screen flex-col items-center ${hide ? "bg-transparent" : "w-0 bg-[#18181A] md:w-[258px]"} text-white`}
    >
      <MobileSideBar pathname={pathname} />
      <div
        className={`absolute ${hide ? "left-[16px]" : "left-[208px]"} top-[16px] z-20 hidden w-10 items-center justify-center md:flex`}
      >
        <button
          onClick={handleToggle}
          className="flex h-[40px] w-[40px] items-center justify-center"
        >
          {hide ? (
            <SidebarOpen className="h-[32px] w-[32px] text-white" />
          ) : (
            <SidebarClose className="h-[32px] w-[32px] text-white" />
          )}
        </button>
      </div>
      <div
        className={`flex h-full w-full flex-col ${hide ? "absolute w-0 bg-transparent" : "hidden md:flex md:w-[258px] md:min-w-[258px]"}`}
      >
        <Link
          href="/"
          className={`flex h-[80px] w-full items-center justify-start border-b border-white/10 px-4 ${hide ? "opacity-0" : "opacity-100"}`}
        >
          <h2 className="select-none text-nowrap">PDF Uploader</h2>
        </Link>
        <div className="flex h-full w-full flex-row-reverse items-start justify-between p-8">
          {!hide && <SidebarContent hide={hide} pathname={pathname} />}
        </div>
      </div>
    </div>
  );
}
