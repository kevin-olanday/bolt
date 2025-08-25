"use client"
import { TopNav } from "@/components/top-nav"
import { DashboardCard } from "@/components/dashboard-card"
import { QuickLinksHorizontal } from "@/components/quick-links-horizontal"
import { Footer } from "@/components/footer"
import {
  Wrench,
  List,
  GraduationCap,
  Grid3X3,
  Users,
  BarChart3,
  Calendar,
  Shield,
  Settings,
  LineChart,
  MessageSquare,
  MessageCircle,
  Zap,
  Sun,
  Moon,
  Star,
  FileText,
  FileLock,
  Search,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { getModuleConfig, type ModuleConfig } from "@/lib/modules"
import type { Module } from "@/lib/modules"

const upliftingMessages = [
  "Welcome aboard <strong class='text-emerald-300'>The BASE</strong>.",
  "All systems green. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Initializing... Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "System access granted. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "You’ve arrived. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "<strong class='text-emerald-300'>The BASE</strong> is online. Welcome aboard.",
  "Access confirmed. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Welcome back to <strong class='text-emerald-300'>The BASE</strong>, commander.",
  "Ops Control activated. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Data synced. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Launch sequence complete. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Secure connection established. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "System calibration complete. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Stability confirmed. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "All workflows go. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Energy flow optimized. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Command deck secured. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Connection stable. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Diagnostics complete. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "All modules engaged. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Firewall secure. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Protocol accepted. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Ops grid aligned. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "System integrity verified. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Power stabilized. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Protocol confirmed. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Systems synchronized. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Access point secured. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Core modules activated. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "Encryption complete. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
  "System heartbeat steady. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",

  "Welcome to <strong class='text-emerald-300'>The BASE</strong> — what are you building today?",
  "Welcome back to <strong class='text-emerald-300'>The BASE</strong> — let’s get to work.",
  "Welcome to <strong class='text-emerald-300'>The BASE</strong> — ready to launch?",
  "Welcome back to <strong class='text-emerald-300'>The BASE</strong> — time to make progress.",
  "Welcome to <strong class='text-emerald-300'>The BASE</strong> — where will you start today?",
  "Mission parameters loaded. Welcome to <strong class='text-emerald-300'>The BASE</strong>.",
];

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

const getRandomMessage = () => {
  return upliftingMessages[Math.floor(Math.random() * upliftingMessages.length)]
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    List: List,
    GraduationCap: GraduationCap,
    Grid3X3: Grid3X3,
    Users: Users,
    BarChart3: BarChart3,
    Calendar: Calendar,
    Shield: Shield,
    Settings: Settings,
    LineChart: LineChart,
    MessageSquare: MessageSquare,
    MessageCircle: MessageCircle,
    Zap: Zap,
    FileText: FileText,
    FileLock: FileLock,
  }
  return iconMap[iconName] || Wrench // Default to Wrench if icon not found
}

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("")
  const [upliftingMessage, setUpliftingMessage] = useState("")
  const [currentUpdate, setCurrentUpdate] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const currentUserRole = "Analyst" // Simulate current user as Analyst (not DevOps)

  useEffect(() => {
    setGreeting(getTimeBasedGreeting())
    setUpliftingMessage(getRandomMessage())
    
    // Initialize search from URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const searchParam = urlParams.get('search')
      if (searchParam) {
        setSearchTerm(searchParam)
      }
    }

    // Listen for navbar search events
    const handleNavbarSearch = (event: CustomEvent) => {
      setSearchTerm(event.detail.searchTerm)
    }

    window.addEventListener('navbarSearch', handleNavbarSearch as EventListener)
    
    return () => {
      window.removeEventListener('navbarSearch', handleNavbarSearch as EventListener)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      try {
        // Fetch modules
        const { data, error } = await supabase.from("modules").select("*").order("sort_order", { ascending: true })

        if (error) {
          console.error("[v0] Error fetching modules:", error)
          return
        }

        // Debug: Log the modules before sorting
        console.log("Modules before sorting:", data?.map(m => ({ name: m.name, status: m.status, sort_order: m.sort_order })))
        
        // Force complete reordering with role-based access priority
        const sortedModules = data ? [
          // First: Accessible active modules (user can actually use)
          ...data.filter(m => m.status === "active" && hasModuleAccess(m)).sort((a, b) => a.sort_order - b.sort_order),
          // Second: Inaccessible active modules (role-restricted but active)
          ...data.filter(m => m.status === "active" && !hasModuleAccess(m)).sort((a, b) => a.sort_order - b.sort_order),
          // Third: All coming_soon modules
          ...data.filter(m => m.status === "coming_soon").sort((a, b) => a.sort_order - b.sort_order),
          // Fourth: All other non-active modules (maintenance, disabled, etc.)
          ...data.filter(m => m.status !== "active" && m.status !== "coming_soon").sort((a, b) => a.sort_order - b.sort_order)
        ] : []
        
        // Debug: Log the modules after sorting
        console.log("Modules after sorting:", sortedModules.map(m => ({ name: m.name, status: m.status, sort_order: m.sort_order })))

        setModules(sortedModules)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter modules based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredModules(modules)
      return
    }

    const filtered = modules.filter((module) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        module.title.toLowerCase().includes(searchLower) ||
        module.description.toLowerCase().includes(searchLower) ||
        module.name.toLowerCase().includes(searchLower) ||
        (module.visible_to_roles && module.visible_to_roles.some(role => role.toLowerCase().includes(searchLower)))
      )
    })
    
    setFilteredModules(filtered)
  }, [searchTerm, modules])

  // Auto-rotate carousel updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % 3)
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [])

  // Easter Egg: Konami Code + Secret Key
  useEffect(() => {
    let konamiCode: string[] = []
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
    
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiCode.push(e.code)
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift()
      }
      
      if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Konami code detected, now wait for secret key - UAM Squad Question
        const secretKey = prompt('🎯 Easter Egg Activated!\n\nWho is the best squad in UAM?')
        if (secretKey?.toLowerCase() === 'poseidon') {
          setShowEasterEgg(true)
        } else if (secretKey) {
          alert('❌ Wrong key! Try again...')
        }
        konamiCode = [] // Reset for next attempt
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const hasModuleAccess = (module: Module) => {
    // If no roles specified, module is available to everyone
    if (!module.visible_to_roles || module.visible_to_roles.length === 0) {
      return true
    }
    // Check if current user's role is in the module's visible_to_roles array
    return module.visible_to_roles.includes(currentUserRole)
  }

  const handleCardClick = (module: Module) => {
    console.log(`[v0] ${module.title} card clicked`)

    const moduleConfig = getModuleConfig(module.name)
    if (moduleConfig?.path) {
      window.location.href = moduleConfig.path
    }
  }

  const getModuleConfigFromRegistry = (moduleName: string) => {
    return getModuleConfig(moduleName)
  }

  const getUserName = () => {
    return "Kevin" // Generic greeting since we're using SSO and no profiles table
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      {/* Updated greeting section with distinct background and better separation */}
              <div className="relative overflow-hidden border-b-2 border-indigo-500/40 shadow-xl" style={{ backgroundImage: 'url(/header-pattern.png)', backgroundSize: '600px', backgroundPosition: 'center' }}>
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 via-slate-700/20 to-slate-800/20"></div>

        
                  <div className="max-w-screen-xl mx-auto px-8 py-12 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Left Column: Greeting */}
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
                          {greeting === "morning" ? (
                            <Sun className="w-12 h-12 text-yellow-300" />
                          ) : greeting === "evening" ? (
                            <Moon className="w-12 h-12 text-indigo-300" />
                          ) : (
                            <Star className="w-12 h-12 text-blue-300" />
                          )}
                          Good {greeting}, {getUserName()}!
                        </h1>
                        <p className="text-white/90 max-w-2xl leading-relaxed text-xl font-medium">
                          <span dangerouslySetInnerHTML={{ __html: upliftingMessage }} />
                        </p>
                      </div>
                      
                      {/* Right Column: What's New in BizOps */}
                      <div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                          {/* Single Update Display */}
                          <div className="min-h-[80px]">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${currentUpdate === 0 ? 'bg-blue-400' : currentUpdate === 1 ? 'bg-purple-400' : 'bg-amber-400'}`}></div>
                              <span className="text-sm text-blue-200 font-medium">
                                {currentUpdate === 0 ? 'Latest Update' : currentUpdate === 1 ? 'New Feature' : 'System Notice'}
                              </span>
                            </div>
                            <p className="text-white/90 text-sm mb-3">
                              {currentUpdate === 0 
                                ? 'Enhanced search functionality with real-time filtering across all modules'
                                : currentUpdate === 1 
                                ? 'Improved loading states and better error handling across the platform'
                                : 'All modules now feature consistent branding and improved navigation'
                              }
                            </p>
                            <div className="text-xs text-blue-300 hover:text-blue-200 transition-colors cursor-pointer">
                              Read more →
                            </div>
                          </div>
                          
                          {/* Navigation Dots */}
                          <div className="flex justify-center gap-2 mt-3">
                            {[0, 1, 2].map((index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentUpdate(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                  currentUpdate === index 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white/30 hover:bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
      </div>

      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-8 py-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 mt-8 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Left Column: Toolkit (Main Content) - Takes up most of the screen */}
            <div className="xl:col-span-4">
              {/* Apps and Services Section - Now prominently positioned */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Wrench className="h-6 w-6 text-[#14B8A6]" />
                    Apps and Services
                    {searchTerm && (
                      <span className="text-lg font-normal text-slate-600 dark:text-slate-400">
                        ({filteredModules.length} found)
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              {/* Apps and Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-40 bg-[#E2E8F0] dark:bg-slate-800 rounded-lg animate-pulse" />
                    ))
                  : filteredModules.length === 0
                  ? (
                      <div className="col-span-full text-center py-12">
                        <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                          {searchTerm ? "Mission parameters not found" : "No modules available"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {searchTerm ? `That search didn't return any modules in The BASE.` : "No modules are currently available in the system."}
                        </p>
                      </div>
                    )
                  : filteredModules.map((module) => {
                      const moduleConfig = getModuleConfigFromRegistry(module.name)
                      const IconComponent = getIconComponent(module.icon)
                      const hasAccess = hasModuleAccess(module)
                      const isEnabled = module.status === "active" && hasAccess

                      return (
                        <DashboardCard
                          key={module.id}
                          title={module.title}
                          subtitle={module.description}
                          enabled={isEnabled}
                          status={module.status}
                          icon={IconComponent}
                          isHero={moduleConfig?.isHero && isEnabled}
                          hasAccess={hasAccess}
                          userRole={currentUserRole}
                          requiredRoles={module.visible_to_roles || undefined}
                          onClick={isEnabled ? () => handleCardClick(module) : undefined}
                        />
                      )
                    })}
              </div>
            </div>

            {/* Right Column: My Work + Quick Links (Sidebar) */}
            <div className="xl:col-span-1">
              <div className="space-y-6">
                {/* My Work Section */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-[#4F46E5]" />
                    My Work
                  </h2>
                  <div className="space-y-3">
                    {/* JIRA Tickets Card */}
                    <div 
                      className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => window.open('https://your-company.atlassian.net/issues/?filter=assignee=currentUser()', '_blank')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3 text-[#0052CC]" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">JIRA Tickets</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-[#4F46E5] hover:text-[#3730A3] transition-colors">
                        12
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Assigned to me
                      </div>
                    </div>

                    {/* Helix Tickets Card */}
                    <div 
                      className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => window.open('https://your-helix-system.com/tickets/assigned', '_blank')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-3 w-3 text-[#14B8A3]" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Helix Tickets</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-[#4F46E5] hover:text-[#3730A3] transition-colors">
                        5
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Assigned to me
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links Section */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-[#F59E0B]" />
                    Quick Links
                  </h2>
                  <div className="bg-white dark:bg-card rounded-lg shadow-sm border p-4">
                    <QuickLinksHorizontal />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cool Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowEasterEgg(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-indigo-500/50 shadow-2xl p-8 max-w-md mx-4 transform animate-in zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowEasterEgg(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            {/* Content */}
            <div className="text-center space-y-6">
              {/* Animated icon */}
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <img src="/clap.gif" alt="Clapping" className="w-20 h-20 rounded-full" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-sm">⭐</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <span className="text-sm">🚀</span>
                </div>
              </div>
              
              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Easter Egg Found!</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
              
              {/* Developer info */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl text-slate-300 mb-3">
                    Thank you for using The BASE
                  </div>
                  <div className="text-lg text-slate-400">
                    made with ❤️ by
                  </div>
                  <div className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mt-2">
                    Kevin Olanday
                  </div>
                </div>
                

              </div>
              
              {/* Action button */}
              <button
                onClick={() => setShowEasterEgg(false)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                Go back to The BASE
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
