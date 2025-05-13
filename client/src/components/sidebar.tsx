"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { adminMenu } from "@/app/(dashboard)/menus/adminMenu"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-[280px] flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold">NextPhoton</h2>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3">
        {adminMenu.map((group, index) => (
          <div key={group.title} className="py-4">
            <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-muted font-medium"
                    )}
                  >
                    <Link href={item.href}>
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
            {index < adminMenu.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
} 