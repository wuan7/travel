"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Category, Continent } from "@prisma/client";
import TestCarousel from "./TestCarousel";
import { CategoryWithCountries, ContinentWithCountries } from "../types";
interface TestTabCarouseProps {
  type?: string;
  continentTabs?: ContinentWithCountries[];
  categoriesTabs?: CategoryWithCountries[];
  isLoading?: boolean;
}
const TestTabCarouse = ({
  continentTabs,
  categoriesTabs,
  isLoading,
}: TestTabCarouseProps) => {
  const [selectedTab, setSelectedTab] = useState<
    Continent["id"] | Category["id"]
  >();
  useEffect(() => {
    if (continentTabs) setSelectedTab(continentTabs[0]?.id || "");
    if (categoriesTabs) setSelectedTab(categoriesTabs[0]?.id || "");
  }, [continentTabs, categoriesTabs]);

  const onChangeTab = (value: Continent["id"] | Category["id"]) => {
    setSelectedTab(value);
  };
  return (
    <div className="w-full overflow-hidden">
      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={(value) => onChangeTab(value)}
        className=""
      >
        <TabsList className="flex justify-start gap-2 p-3 h-[50px] bg-transparent min-w-[250px]  md:max-w-min w-full  overflow-x-auto overflow-y-hidden">
          {continentTabs?.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="transition-colors p-4 rounded-2xl cursor-pointer
                    data-[state=active]:bg-primary data-[state=active]:text-white 
                    data-[state=inactive]:bg-[#F7F9FA] data-[state=inactive]:text-primary
                "
            >
              {tab.name}
            </TabsTrigger>
          ))}
          {categoriesTabs?.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
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
        {continentTabs?.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <TestCarousel countries={tab.countries} isLoading={isLoading} />
          </TabsContent>
        ))}
        {categoriesTabs?.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <TestCarousel
              categoryCountries={tab.countries}
              isLoading={isLoading}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TestTabCarouse;
