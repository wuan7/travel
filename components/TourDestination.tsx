import { getDestinationById } from "../app/actions/destination";
import { Destination } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface TourDestinationProps {
  destinationId: string;
}
const TourDestination = ({ destinationId }: TourDestinationProps) => {
  const [destination, setDestination] = useState<Destination>({
    id: "",
    name: "",
    imageUrl: "",
    imagePublicId: "",
    countryId: "",
    description: "",
  });
  useEffect(() => {
    const fetDestination = async () => {
      try {
        const destination = await getDestinationById(destinationId!);
        setDestination(destination);
      } catch (error) {
        console.log(error);
      }
    };
    if (destinationId) {
        fetDestination();
    }
  }, [destinationId]);
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center font-semibold py-2">
      {destination.name}
    </div>
  );
};

export default TourDestination;
