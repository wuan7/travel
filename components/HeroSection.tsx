import Image from "next/image";
import React from "react";
import SearchBox from "./SearchBox";

const HeroSection = () => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <Image
        src="/img/hero.webp"
        alt="Tour du lịch"
        layout="fill" // Ảnh sẽ phủ toàn bộ div cha
        objectFit="cover" // Giữ đúng tỷ lệ mà không bị méo
        className="w-full h-full"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white ">
        <h1 className="text-4xl font-bold">Khám Phá Thế Giới Cùng Chúng Tôi</h1>
        <p className="mt-2 text-lg">Tìm tour du lịch hoàn hảo cho bạn</p>
    
        {/* Ô tìm kiếm */}
        <SearchBox />
      </div>
    </div>
  );
};

export default HeroSection;
