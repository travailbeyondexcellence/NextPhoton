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
import { adminMenu } from "@/app/(dashboard)/roleMenus/adminMenu"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarHeader className="p-6 flex justify-between :hover:cursor-pointer" onClick={() => router.push("/")} >

        <span className="flex items-center gap-2 " onClick = {() => router.push("/")}>
          <Image
            src="/PhotonLogo/PhotonEarth.png"
            alt="Photon Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <h2 className="text-lg font-bold :hover:cursor-pointer" onClick={() => router.push("/")}>Next Photon</h2></span>
      </SidebarHeader>
      <SidebarContent className="px-4">
        {adminMenu.map((group, index) => (
          <div key={group.title} className="py-4">
            <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">
              {group.title}
            </h3>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon // Store the icon component
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
            {index < adminMenu.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </SidebarContent>
    </ShadcnSidebar>
  )
} 