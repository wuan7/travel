"use client";
import React from 'react'
import { useAdminModal } from '@/app/hooks/useAdminModal'
import { Button } from '@/components/ui/button'

const Manage = () => {
  const { openCreateCountry } = useAdminModal();

  return (
    <div className='m-4'>
         <Button onClick={openCreateCountry}>Tạo quốc gia</Button>
    </div>
  )
}

export default Manage