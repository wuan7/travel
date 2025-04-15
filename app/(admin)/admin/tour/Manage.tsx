"use client";
import React from 'react'
import { useAdminModal } from '@/app/hooks/useAdminModal'
import { Button } from '@/components/ui/button'


const Manage = () => {
  const { openCreateTour } = useAdminModal();
  return (
    <div className='m-4'>
             <Button onClick={openCreateTour}>Tạo tour</Button>
        </div>
  )
}

export default Manage