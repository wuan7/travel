"use client";
import React, { useEffect, useState } from "react";
import { getCategories } from "@/app/actions/category";
import TestTabCarouse from "./TestTabCarouse";
import { CategoryWithCountries } from "@/app/types";
const ExploreDestinations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryWithCountries[]>([]);


  useEffect(() => {
          const fetchCategories = async () => {
            try {
              setIsLoading(true);
              const data = await getCategories();
              setCategories(data);
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchCategories();
        }, []);
 
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-[#F0298A]">🌸Điểm Du Lịch Phải Khám Phá</h2>
      <TestTabCarouse categoriesTabs={categories} isLoading={isLoading}/>
    </section>
  );
};

export default ExploreDestinations;
