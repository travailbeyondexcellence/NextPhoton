"use client"

import Link from "next/link"
import Image from "next/image";
import { LogoComponent } from "./LogoComponent";

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

import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';


import { useState, useEffect } from "react"

import { adminMenu } from "@/app/(dashboard)/roleMenus/adminMenu"


import { useTheme } from "next-themes";

export function DashboardSidebar() {

  const [mounted, setMounted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
  }, []);
  

  useEffect(() => setMounted(true), []);



  const [openStates, setOpenStates] = useState<boolean[][]>(() =>
    adminMenu.map((group) => group.items.map(() => false))
  );


  const pathname = usePathname()
  const router = useRouter()






  const themeObject = useTheme();

  if (!mounted) return null;
  const sidebarHeaderBackground = themeObject.theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200';
  // const sidebarHeaderText = themeObject.theme === 'dark' ? 'text-gray-400' : 'text-gray-700';

  return (


    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <SidebarHeader className="px-0 pl-4 ml-0 flex h-16 justify-start items-center bg-card/10 backdrop-blur-sm border-b border-border/20">
          <span className="pl-0 p-0 flex items-center gap-2 justify-start hover:cursor-pointer" onClick={() => router.push("/")}>
            <LogoComponent width={48} height={48} />
            <h2 className="text-lg font-bold hover:cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">NextPhoton</h2>
          </span>
        </SidebarHeader>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar className="h-full w-full px-2" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
            
            {adminMenu.map((group, groupIndex) => (
              <div
                key={group.title}
                className={`py-2 overflow-hidden ${groupIndex === 0 ? "mt-2" : ""}`}
              >
                <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground dark:text-gray-500">
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
                          <CollapsibleTrigger className="flex items-center justify-between w-[90%] text-sm py-2 font-medium">
                            <span className="flex items-center gap-2 ">
                              <item.icon size={20} className="mr-2" /> {item.label}
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
                                className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
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
                {groupIndex < adminMenu.length - 1 && <Separator className="my-0" />}
              </div>
            ))} 
        </SimpleBar>
      </div>
    </div>
  )
} 