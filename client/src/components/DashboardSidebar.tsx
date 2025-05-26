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

import { adminMenu } from "@/app/(dashboard)/roleMenus/adminMenu"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarHeader className="p-6 flex justify-between :hover:cursor-pointer" onClick={() => router.push("/")} >

        <span className="flex items-center gap-2 " onClick={() => router.push("/")}>
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

                if (item.children) {
                  return (
                    <Collapsible key={item.href} className="px-2">
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm py-2 font-medium">
                        <span className="flex items-center gap-2">
                          <item.icon size={16} /> {item.label}
                        </span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6">
                        {item.children.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href || "#"}
                            className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                          >
                            {subItem.label}
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
            {index < adminMenu.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </SidebarContent>
    </ShadcnSidebar>
  )
} 