"use client";
import React, { useEffect, useState } from "react";
import { getContinents } from "../app/actions/continent";
import { ContinentWithPosts } from "../types";
import PostTabCarousel from "./PostTab";
const InspiringReads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [continents, setContinents] = useState<ContinentWithPosts[]>([]);

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        setIsLoading(true);
        const data = await getContinents();
        console.log("continents with posts", data);
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
      <h2 className="text-2xl font-bold mb-4 text-[#F0298A]">
        🌸Kinh nghiệm du lịch
      </h2>
      <PostTabCarousel data={continents} isLoading={isLoading} />
    </section>
  );
};

export default InspiringReads;
