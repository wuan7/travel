"use client";
import React from 'react'
import { useAdminModal } from '@/hooks/useAdminModal'
import { Button } from '@/components/ui/button'

const Manage = () => {
  const { openCreateContinent } = useAdminModal();

  return (
    <div className='m-4'>
         <Button onClick={openCreateContinent}>Tạo khu vực</Button>
    </div>
  )
}

export default Manage