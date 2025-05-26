"use client"

import Link from "next/link"
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { ChevronDown, ChevronRightSquare } from "lucide-react";

import { useState } from "react"

import { adminMenu } from "@/app/(dashboard)/roleMenus/adminMenu"

export function DashboardSidebar() {
 


  const [openStates, setOpenStates] = useState<boolean[][]>(() =>
    adminMenu.map((group) => group.items.map(() => false))
  );


  const pathname = usePathname()
  const router = useRouter()
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;




  return (

    <div >
  {/* Sidebar content */}

      <ShadcnSidebar collapsible="offcanvas" className="custom-scrollbar overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted scrollbar-track-transparent bg-background border-none dark:border-none">
        <SidebarHeader className="px-0 flex h-16 items-center justify-start :hover:cursor-pointer  bg-gray-300 light:bg-gray-300 dark:bg-gray-900 dark:text-gray-500"  >

        <span className="flex items-center gap-2 " onClick={() => router.push("/")}>
          <Image
            src="/PhotonLogo/PhotonEarth.png"
            alt="Photon Logo"
            width={48}
            height={48}
            className="rounded-full md:width={48} md:height={48}"
          />
            <h2 className="text-lg font-bold :hover:cursor-pointer text-muted-foreground text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500"> Next Photon </h2>
        </span>


      </SidebarHeader>
        <SidebarContent className="px-4 bg-gray-300 text-yellow-200 dark:bg-gray-900 dark:text-gray-300">
        {adminMenu.map((group, groupIndex) => (
          <div key={group.title} className="py-2">
            <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground dark:text-gray-500">
              {group.title}
            </h3>
            <SidebarMenu>
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href
                const Icon = item.icon // Store the icon component

                if (item.children) {
                  return (
                    <Collapsible key={itemIndex} className="px-2" open={openStates[groupIndex][itemIndex]}
                      onOpenChange={() =>
                        setOpenStates((prev) =>
                          prev.map((groupArr, gIdx) =>
                            gIdx === groupIndex
                              ? groupArr.map((val, i) =>
                                i === itemIndex ? !val : val
                              )
                              : groupArr
                          )
                        )
                    }>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm py-2 font-medium">
                        <span className="flex items-center gap-2">
                          <item.icon size={16} /> {item.label}
                        </span>

                        <ChevronRightSquare
                          size={16}
                          className={`transition-transform duration-300 ${openStates[groupIndex][itemIndex] ? "rotate-90" : "rotate-0"
                            }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4">
                        {item.children.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href || "#"}
                            className="flex items-center gap-2  py-1 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Icon size={16} />
                            <span className="">
                          
                            
                              {subItem.label}
                            </span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )

                }


                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      data-active={isActive}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-muted font-medium"
                      )}
                    >
                      <Link href={item.href}>
                        <span className="mr-2">
                          <Icon size={20} />
                        </span>
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
            {groupIndex < adminMenu.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </SidebarContent>
      </ShadcnSidebar>
      
    </div>
  )
} 