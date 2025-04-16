"use client";
import React from "react";
import { useAdminModal } from "../../../../hooks/useAdminModal";
import { Button } from "../../../../components/ui/button";

const Manage = () => {
  const { openCreateSchedule } = useAdminModal();
  return (
    <div className="m-4">
      <Button onClick={openCreateSchedule}>Tạo lịch trình tour</Button>
    </div>
  );
};

export default Manage;
