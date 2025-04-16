"use client";
import { useAtom } from "jotai";
import {
  createRegion,
  createDestination,
  createCategory,
  createTour,
  createContinent,
  createCountry,
  createSchedule,
  createBooking,
  createPost
} from "../app/atoms/adminAtom";

export const useAdminModal = () => {
  const [isOpenCreateRegion, setOpenCreateRegion] = useAtom(createRegion);
  const [isOpenCreateContinent, setOpenCreateContinent] = useAtom(createContinent);
  const [isOpenCreateCountry, setOpenCreateCountry] = useAtom(createCountry);
  const [isOpenCreateDestination, setOpenCreateDestination] =
    useAtom(createDestination);
  const [isOpenCreateCategory, setOpenCreateCategory] = useAtom(createCategory);

  const [isOpenCreateTour, setOpenCreateTour] = useAtom(createTour);
  const [isOpenCreateSchedule, setOpenCreateSchedule] = useAtom(createSchedule);

  const [isOpenCreateBooking, setOpenCreateBooking] = useAtom(createBooking);
  const [isOpenCreatePost, setOpenCreatePost] = useAtom(createPost);

  const openCreateTour = () => setOpenCreateTour(true);
  const closeCreateTour = () => setOpenCreateTour(false);

  const openCreateDestination = () => setOpenCreateDestination(true);
  const closeCreateDestination = () => setOpenCreateDestination(false);

  const openCreateRegion = () => setOpenCreateRegion(true);
  const closeCreateRegion = () => setOpenCreateRegion(false);

  const openCreateContinent = () => setOpenCreateContinent(true);
  const closeCreateContinent = () => setOpenCreateContinent(false);

  const openCreateCountry = () => setOpenCreateCountry(true);
  const closeCreateCountry= () => setOpenCreateCountry(false);

  const openCreateCategory = () => setOpenCreateCategory(true);
  const closeCreateCategory = () => setOpenCreateCategory(false);

  const openCreateSchedule = () => setOpenCreateSchedule(true);
  const closeCreateSchedule = () => setOpenCreateSchedule(false);

  const openCreateBooking = () => setOpenCreateBooking(true);
  const closeCreateBooking = () => setOpenCreateBooking(false);

  const openCreatePost = () => setOpenCreatePost(true);
  const closeCreatePost = () => setOpenCreatePost(false);

  return {
    openCreateRegion,
    isOpenCreateRegion,
    closeCreateRegion,
    openCreateDestination,
    isOpenCreateDestination,
    closeCreateDestination,
    openCreateCategory,
    isOpenCreateCategory,
    closeCreateCategory,
    openCreateTour,
    isOpenCreateTour,
    closeCreateTour,
    isOpenCreateContinent,
    openCreateContinent,
    closeCreateContinent,
    isOpenCreateCountry,
    openCreateCountry,
    closeCreateCountry,
    openCreateSchedule,
    isOpenCreateSchedule,
    closeCreateSchedule,
    openCreateBooking,
    isOpenCreateBooking,
    closeCreateBooking,
    openCreatePost,
    isOpenCreatePost,
    closeCreatePost
  };
};
