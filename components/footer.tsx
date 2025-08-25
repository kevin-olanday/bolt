import { Zap } from "lucide-react"

// BASE Logo Component for Footer using actual favicon asset
function BaseLogoFooter() {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <img 
        src="/favicon-96x96.png" 
        alt="The BASE Logo" 
        className="w-full h-full object-contain rounded-md shadow-sm"
      />
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-t-2 border-indigo-500/20 mt-auto shadow-xl">
      <div className="max-w-screen-xl mx-auto px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* Left Section - App Version */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center hover:bg-slate-600/50 transition-all duration-300 group">
              <BaseLogoFooter />
            </div>
            <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-200">The BASE</span>
              <span className="text-xs text-slate-400">v1.0.0</span>
            </div>
          </div>

          {/* Center Section - Tagline */}
          <div className="hidden lg:block text-center">

            <span className="text-xs text-slate-500">
              Last updated: Aug 22, 2025
            </span>
          </div>

          {/* Right Section - Links */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-slate-200 transition-all duration-200 hover:underline decoration-slate-400 hover:decoration-slate-200 font-medium">
                Documentation
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-200 transition-all duration-200 hover:underline decoration-slate-400 hover:decoration-slate-200 font-medium">
                Report Issue
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-200 transition-all duration-200 hover:underline decoration-slate-400 hover:decoration-slate-200 font-medium">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
