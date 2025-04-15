"use client";
import { useEffect, useState } from "react";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import CreateRegion from "./CreateRegion";
import CreateDestination from "./CreateDestination";
import CreateCategory from "./CreateCategory";
import CreateTour from "./CreateTour";
import CreateContinent from "./CreateContinent";
import CreateCountry from "./CreateCountry";
import CreateSchedule from "./CreateSchedule";
const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
    <CreateTour />
    <CreateContinent />
    <CreateCountry />
    <CreateDestination />
    <CreateSchedule />
    <CreateCategory />
      <CreateRegion />
      <SignIn />
      <SignUp />
    </>
  );
};

export default Modals;
