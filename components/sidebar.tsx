"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Users, Package, Settings, Menu, X, User, Zap } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "#", icon: LayoutDashboard, active: true },
  { name: "Users", href: "#", icon: Users, active: false },
  { name: "Modules", href: "#", icon: Package, active: false },
  { name: "Settings", href: "#", icon: Settings, active: false },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 h-16 px-6 border-b border-sidebar-border/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">BOLT</span>
              <span className="text-xs text-sidebar-foreground/60">BizOps Links and Tools</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.name}
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11 transition-all duration-300 group",
                    item.active
                      ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800"
                      : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-transform duration-300")} />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border/50">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-primary/50 transition-colors cursor-pointer group">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.png" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">john.doe@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
