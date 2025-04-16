"use client";
import React, { useEffect, useState } from "react";
import TestTabCarouse from "./TestTabCarouse";
import { getContinents } from "@/app/actions/continent";
import { ContinentWithCountries } from "@/types";


const TravelDestinations = () => {
  const [isLoading, setIsLoading] = useState(false);
    const [continents, setContinents] = useState<ContinentWithCountries[]>([]);

    useEffect(() => {
        const fetchContinents = async () => {
          try {
            setIsLoading(true);
            const data = await getContinents();
            setContinents(data);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchContinents();
      }, []);
 

  return (
    <section className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-[#F0298A]">🌸Điểm Du Lịch Nổi Bật</h2>
      <TestTabCarouse continentTabs={continents} isLoading={isLoading}/>
    </section>
  );
};

export default TravelDestinations;
