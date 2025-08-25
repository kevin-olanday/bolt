import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 border-t border-slate-700 dark:border-slate-800 mt-auto shadow-lg">
      <div className="max-w-screen-xl mx-auto px-8 py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Left Section - App Version */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-slate-600 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-500 dark:hover:bg-slate-600 transition-all duration-300 group">
              <Zap className="h-3 w-3 text-slate-300 dark:text-slate-400 group-hover:animate-pulse group-hover:text-yellow-300" />
            </div>
            <span className="text-sm font-medium text-slate-300 dark:text-slate-400">BOLT v1.0.0</span>
          </div>

          {/* Center Section - Last Updated (Hidden on small screens) */}
          <div className="hidden lg:block text-center">
            <span className="text-xs text-slate-500 dark:text-slate-500">
              Last updated: Aug 22, 2025
            </span>
          </div>

          {/* Right Section - Links */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-slate-200 dark:hover:text-slate-300 transition-all duration-200 hover:underline decoration-slate-400 hover:decoration-slate-200">
                Documentation
              </a>
              <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-slate-200 dark:hover:text-slate-300 transition-all duration-200 hover:underline decoration-slate-400 hover:decoration-slate-200">
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
