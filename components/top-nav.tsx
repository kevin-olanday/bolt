"use client"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

// BASE Logo Component using actual favicon asset
function BaseLogo() {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <img 
        src="/favicon-96x96.png" 
        alt="The BASE Logo" 
        className="w-full h-full object-contain rounded-lg shadow-lg"
        style={{ filter: 'brightness(0) invert(1)' }} // Makes logo pure white
      />
    </div>
  )
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 border-b-2 border-indigo-500/50">
      <div className="max-w-screen-xl mx-auto flex h-18 items-center justify-between px-8">
        {/* Left: Logo and Product Name */}
        <Link href="/" className="flex items-center gap-6 hover:opacity-90 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="group-hover:scale-105 transition-transform duration-300">
              <BaseLogo />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none group-hover:text-indigo-100 transition-colors duration-300">
                  The BASE
                </h1>
                <div className="px-3 py-1.5 bg-indigo-500/20 backdrop-blur-sm rounded-full border border-indigo-400/30 group-hover:bg-indigo-500/30 group-hover:border-indigo-300/50 transition-all duration-300">
                  <span className="text-xs font-semibold text-indigo-200 tracking-wide group-hover:text-indigo-100 transition-colors duration-300">v1.0.0</span>
                </div>
                <span className="text-xs font-medium text-indigo-200 leading-none tracking-wider uppercase group-hover:text-indigo-100 transition-colors duration-300">
                  BizOps Apps & Services Ecosystem
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative hidden md:block group cursor-text">
            <Input
              id="navbar-search"
              placeholder="Search apps, services, tools..."
              className="pl-10 pr-10 w-80 bg-white/10 backdrop-blur-sm border-indigo-400/30 text-white placeholder:text-indigo-200 focus:bg-white/20 focus:border-indigo-300/50 hover:bg-white/15 hover:border-indigo-300/40 transition-all duration-300 ease-out"
              onInput={(e) => {
                const target = e.target as HTMLInputElement
                // Dispatch custom event to communicate with dashboard
                window.dispatchEvent(new CustomEvent('navbarSearch', { 
                  detail: { searchTerm: target.value } 
                }))
              }}
              defaultValue=""
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300 pointer-events-none" />
            
            {/* Clear search button - only show when there's text */}
            <button
              type="button"
              onClick={() => {
                const searchInput = document.getElementById('navbar-search') as HTMLInputElement
                if (searchInput) {
                  searchInput.value = ''
                  // Clear the search in dashboard
                  window.dispatchEvent(new CustomEvent('navbarSearch', { 
                    detail: { searchTerm: '' } 
                  }))
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-300 hover:text-indigo-100 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              style={{ opacity: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-indigo-200 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-indigo-200 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 ease-out group cursor-pointer">
            <Bell className="h-4 w-4 group-hover:animate-pulse" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-400/30 group-hover:scale-110 transition-transform duration-300">
              3
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <div className="text-indigo-200 hover:scale-110 transition-transform duration-300 ease-out cursor-pointer">
            <ThemeToggle />
          </div>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 ease-out group cursor-pointer">
                <Avatar className="h-9 w-9 border-2 border-indigo-400/50 group-hover:border-indigo-300/70 transition-colors duration-300">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold">KO</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <div className="flex items-center justify-start gap-3 p-3">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Kevin Olanday</p>
                  <p className="w-[200px] truncate text-sm text-slate-600 dark:text-slate-300">kevin.olanday@company.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-200 transition-all duration-200">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-200 transition-all duration-200">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-200 transition-all duration-200">Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
