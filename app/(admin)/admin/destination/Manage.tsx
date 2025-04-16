"use client";
import React from 'react'
import { useAdminModal } from '@/hooks/useAdminModal'
import { Button } from '@/components/ui/button'

const Manage = () => {
  const { openCreateDestination } = useAdminModal();

  return (
    <div className='m-4'>
         <Button onClick={openCreateDestination}>Tạo điểm đến</Button>
    </div>
  )
}

export default Manage