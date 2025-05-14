"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { adminMenu } from "@/app/(dashboard)/roleMenus/adminMenu"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <ShadcnSidebar collapsible="offcanvas">
        <SidebarHeader className="p-6 flex justify-between">
          <span><h2 className="text-lg font-semibold">NextPhoton</h2> </span>
         
          
        </SidebarHeader>
        <SidebarContent>
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
      <main className="flex-1">
     
     
        {/* Your main content will be rendered here */}
      </main>
    </SidebarProvider>
  )
} 