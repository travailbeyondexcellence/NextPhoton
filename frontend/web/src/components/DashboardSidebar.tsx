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

import { ChevronRight, Plus, Minus } from "lucide-react";

import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';


import { useState, useEffect } from "react"

import { adminMenu } from "@/app/(dashboard)/roleMenus/adminMenu"
import { useStore } from "@/statestore/store"

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
  const { openSecondarySidebar } = useStore()






  const themeObject = useTheme();

  if (!mounted) return null;
  const sidebarHeaderBackground = themeObject.theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200';
  // const sidebarHeaderText = themeObject.theme === 'dark' ? 'text-gray-400' : 'text-gray-700';

  return (


    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <div className="px-0 pl-4 ml-0 flex h-16 justify-start items-center bg-sidebar-accent/20 theme-backdrop-blur">
          <span className="pl-0 p-0 flex items-center gap-2 justify-start hover:cursor-pointer group transition-all duration-300 ease-out hover:scale-105" onClick={() => router.push("/")}>
            <div className="transition-all duration-300 ease-out group-hover:rotate-3 group-hover:drop-shadow-lg">
              <LogoComponent 
                width={48} 
                height={48} 
                showText={true}
                textClassName="text-lg font-bold hover:cursor-pointer transition-all duration-300 ease-out group-hover:drop-shadow-sm"
              />
            </div>
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar className="h-full w-full px-2" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
            
            {adminMenu.map((group, groupIndex) => (
              <div
                key={group.title}
                className={`py-2 overflow-hidden ${groupIndex === 0 ? "mt-2" : ""}`}
              >
                <h3 className="mb-2 px-2 text-sm font-semibold opacity-70 hover:opacity-100 transition-all duration-200 ease-out cursor-default">
                  {group.title}
                </h3>
                <SidebarMenu className="space-y-1">
                  {group.items.map((item, itemIndex) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon // Store the icon component

                    if (item.children) {
                      return (
                        <Collapsible key={itemIndex} className="" open={openStates[groupIndex][itemIndex]}
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
                          <CollapsibleTrigger className="group flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-sm">
                            <span className="flex items-center gap-2 transition-all duration-200 ease-out group-hover:translate-x-1">
                              <item.icon size={20} className="transition-all duration-200 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                              <span className="transition-all duration-200 ease-out opacity-95 group-hover:opacity-100">{item.label}</span>
                            </span>

                            <div className="p-1 hover:bg-sidebar-accent/50 rounded transition-all duration-200 ease-out hover:scale-110">
                              {openStates[groupIndex][itemIndex] ? (
                                <Minus size={16} className="opacity-70 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-x-125" />
                              ) : (
                                <Plus size={16} className="opacity-70 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:rotate-180" />
                              )}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-1">
                            <div className="ml-4 space-y-1">
                              {item.children.map((subItem, subIndex) => {
                                const isSubActive = pathname === subItem.href
                                return (
                                  <Link
                                    key={subIndex}
                                    href={subItem.href || "#"}
                                    className={cn(
                                      "group flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 ease-out",
                                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                      "opacity-85 hover:opacity-100",
                                      "hover:scale-[1.02] hover:shadow-sm",
                                      isSubActive && "bg-sidebar-accent text-sidebar-accent-foreground opacity-100 font-medium shadow-sm"
                                    )}
                                  >
                                    <Icon size={16} className="transition-all duration-200 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                    <span className="transition-all duration-200 ease-out group-hover:translate-x-0.5">{subItem.label}</span>
                                  </Link>
                                )
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )

                    }


                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild={!item.hasSecondaryDrawer}
                          data-active={isActive}
                          className={cn(
                            "w-full justify-start transition-all duration-200 ease-out",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.02] hover:shadow-sm",
                            "group",
                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                          )}
                          onClick={item.hasSecondaryDrawer ? (e) => {
                            e.preventDefault()
                            openSecondarySidebar(item.secondaryDrawerKey || '')
                            router.push(item.href)
                          } : undefined}
                        >
                          {item.hasSecondaryDrawer ? (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center transition-all duration-200 ease-out group-hover:translate-x-1">
                                <span className="mr-2 transition-all duration-200 ease-out group-hover:scale-110">
                                  <Icon size={20} className="transition-all duration-200 ease-out opacity-90 group-hover:opacity-100" />
                                </span>
                                <span className="transition-all duration-200 ease-out opacity-95 group-hover:opacity-100">
                                  {item.label}
                                </span>
                              </div>
                              <ChevronRight size={16} className="opacity-70 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-1" />
                            </div>
                          ) : (
                            <Link href={item.href} className="flex items-center transition-all duration-200 ease-out group-hover:translate-x-1">
                              <span className="mr-2 transition-all duration-200 ease-out group-hover:scale-110">
                                <Icon size={20} className="transition-all duration-200 ease-out opacity-90 group-hover:opacity-100" />
                              </span>
                              <span className="transition-all duration-200 ease-out opacity-95 group-hover:opacity-100">
                                {item.label}
                              </span>
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
                {groupIndex < adminMenu.length - 1 && <Separator className="my-0 opacity-20 hover:opacity-40 transition-opacity duration-200" />}
              </div>
            ))} 
        </SimpleBar>
      </div>
    </div>
  )
} 