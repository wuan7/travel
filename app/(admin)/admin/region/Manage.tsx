"use client";
import React from 'react'
import { useAdminModal } from '@/hooks/useAdminModal'
import { Button } from '@/components/ui/button'

const Manage = () => {
  const { openCreateRegion } = useAdminModal();

  return (
    <div className='m-4'>
         <Button onClick={openCreateRegion}>Tạo khu vực</Button>
    </div>
  )
}

export default Manage