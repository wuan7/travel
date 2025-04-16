import React from 'react'
import { SidebarProvider } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import CheckRole from './CheckRole'
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1'>
        <CheckRole />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout