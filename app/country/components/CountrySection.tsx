"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Country } from "@prisma/client";
import { getCountry } from "../../../app/actions/country";
import TourCarousel from "../../../components/TourCarousel";
import Image from "next/image";
import { Loader } from "lucide-react";
const CountrySection = () => {
  const { id } = useParams();
  const [country, setCountry] = useState<Country>({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
    imagePublicId: "",
    continentId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchdDestination = async () => {
      try {
        setIsLoading(true);
        const countryData = await getCountry(id as string);
        setCountry(countryData);
      } catch (error) {
        console.error("Error fetching country id:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchdDestination();
  }, [id]);
  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="my-4 p-2">
      <div className="my-2">
        <div className="relative w-full h-[500px]">
          <Image
            src={country.imageUrl}
            alt={country.name}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <h1 className="font-bold text-5xl text-primary">{country.name}</h1>
      <p className="mt-2 ">{country.description}</p>
      <div className="my-4">
        <TourCarousel id={id as string} />
      </div>
    </div>
  );
};

export default CountrySection;
