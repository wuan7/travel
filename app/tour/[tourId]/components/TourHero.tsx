import React from "react";
import Image from "next/image";
const TourHero = () => {
  return (
    <div className="w-full h-[500px]">
      <div className="w-full h-full relative">
        <Image
          src="/img/south-korea.webp"
          alt="Main destination"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default TourHero;
