"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EmblaCarousel from "@/components/EmblaCarousel";
import PostCarousel from "./PostCarousel";

interface TabbedCarouselProps {
    type?: string;
    tabs: string[]; // Danh sách tabs
    data: Record<string, { title: string; image: string; category?: string }[]>; // Dữ liệu từng tab (key là tên tab)
  }
const TabbedCarousel = ({ tabs, data, type }: TabbedCarouselProps) => {
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <div className="w-full overflow-hidden">
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="">
        <TabsList className="flex justify-start gap-2 p-3 h-[50px] bg-transparent min-w-[250px]  md:max-w-min w-full  overflow-x-auto overflow-y-hidden">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} 
                className="transition-colors p-4 rounded-2xl cursor-pointer
                    data-[state=active]:bg-primary data-[state=active]:text-white 
                    data-[state=inactive]:bg-[#F7F9FA] data-[state=inactive]:text-primary
                "
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Nội dung tương ứng với từng tab */}
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            {type === "post" ? (
                <PostCarousel slides={data[tab]}/>
            ) : (
                <EmblaCarousel slides={data[tab]} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default TabbedCarousel