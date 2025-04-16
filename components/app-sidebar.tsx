"use client";
import {
  BookCheck,
  CalendarCheck,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  CircleDollarSign,
  CircleUser,
  Home,
  ListPlus,
  Luggage,
  MapPin,
  MapPinHouse,
  Star,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useSidebar, SidebarTrigger } from "../components/ui/sidebar";
// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Users",
    url: "#",
    icon: CircleUser,
    submenu: [
      { title: "Danh sách người dùng", url: "#" },
      { title: "Mountains", url: "#" },
    ],
  },
  {
    title: "Continent",
    url: "/admin/continent",
    icon: MapPin,
  },
  {
    title: "Country",
    url: "/admin/country",
    icon: MapPin,
  },
  {
    title: "Destination",
    url: "/admin/destination",
    icon: MapPinHouse,
  },
  {
    title: "Category",
    url: "/admin/category",
    icon: ListPlus,
  },
  {
    title: "Tour",
    url: "/admin/tour",
    icon: Luggage,
  },
  {
    title: "Schedule",
    url: "/admin/schedule",
    icon: CalendarCheck,
  },
  {
    title: "Booking",
    url: "/admin/booking",
    icon: BookCheck,
  },
  {
    title: "Review",
    url: "#",
    icon: Star,
  },
  {
    title: "Payment",
    url: "#",
    icon: CircleDollarSign,
  },
];

export function AppSidebar() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex ">
            <Link href="/" className={`${state === "collapsed" && "hidden"}`}>
              <Image src="/img/logo.svg" alt="logo" width={135} height={43} />
            </Link>
            <SidebarTrigger
              className="!text-primary cursor-pointer ml-auto size-10"
              icon={state === "expanded" ? ChevronsLeft : ChevronsRight}
            />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <div key={item.title}>
                  {item.submenu && state === "expanded" ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === index ? null : index
                            )
                          }
                        >
                          <item.icon className="!size-6 text-primary" />
                          <span className="font-medium">{item.title}</span>
                          {openDropdown === index ? (
                            <ChevronUp className="ml-auto" />
                          ) : (
                            <ChevronDown className="ml-auto" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {openDropdown === index && (
                        <div className="ml-6 space-y-2">
                          {item.submenu.map((sub) => (
                            <SidebarMenuItem key={sub.title}>
                              <SidebarMenuButton asChild>
                                <Link href={sub.url}>{sub.title}</Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon className="!size-6 text-primary" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
