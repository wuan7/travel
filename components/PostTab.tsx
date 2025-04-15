"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCarousel from "./PostCarousel";
import { ContinentWithPosts } from "@/app/types";
import { Article } from "@prisma/client";

interface TabbedCarouselProps {
  isLoading?: boolean;
    data: ContinentWithPosts[];
  }
const PostTabCarousel = ({ data, isLoading }: TabbedCarouselProps) => {
    const [selectedTab, setSelectedTab] = useState<Article["id"]>();
  useEffect(() => {
      if (data) setSelectedTab(data[0]?.id || "");
    }, [data]);
  return (
    <div className="w-full overflow-hidden">
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="">
        <TabsList className="flex justify-start gap-2 p-3 h-[50px] bg-transparent min-w-[250px]  md:max-w-min w-full  overflow-x-auto overflow-y-hidden">
          {data.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} 
                className="transition-colors p-4 rounded-2xl cursor-pointer
                    data-[state=active]:bg-primary data-[state=active]:text-white 
                    data-[state=inactive]:bg-[#F7F9FA] data-[state=inactive]:text-primary
                "
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Nội dung tương ứng với từng tab */}
        {data.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
                <PostCarousel slides={tab.articles} isLoading={isLoading}/>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default PostTabCarousel