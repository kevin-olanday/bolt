"use client"
import { Search, Bell, HelpCircle, Zap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-lg" style={{ background: "#4F46E5" }}>
      <div className="max-w-screen-xl mx-auto flex h-16 items-center justify-between px-8">
        {/* Left: Logo and Product Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">BOLT</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-gray-200 focus:bg-white/30"
            />
          </div>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#14B8A6]">
              3
            </Badge>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <div className="text-white">
            <ThemeToggle />
          </div>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/20">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarImage src="/placeholder-user.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">John Doe</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">john.doe@company.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
