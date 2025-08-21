"use client"
import { TopNav } from "@/components/top-nav"
import { DashboardCard } from "@/components/dashboard-card"
import { QuickLinksHorizontal } from "@/components/quick-links-horizontal"
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
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { getModuleConfig, type ModuleConfig } from "@/lib/modules"
import type { Module } from "@/lib/modules"

const upliftingMessages = [
  "What will you build today?",
  "Ready to drive operational excellence?",
  "Let's optimize for success!",
  "Time to streamline your workflow!",
  "Your efficiency makes the difference!",
  "Ready to scale new heights?",
  "Let's automate for impact!",
  "Time to orchestrate excellence!",
  "Your processes power progress!",
  "Ready to deploy strategic solutions?",
  "Let's engineer operational success!",
  "Time to maximize productivity!",
  "Your systems create competitive advantage!",
  "Ready to optimize performance?",
  "Let's synchronize for results!",
  "Time to align resources effectively!",
  "Your coordination drives outcomes!",
  "Ready to facilitate growth?",
  "Let's cultivate operational excellence!",
  "Time to amplify business impact!",
  "Your leadership accelerates progress!",
  "Ready to mentor for success?",
  "Let's collaborate for innovation!",
  "Time to execute with precision!",
  "Your expertise delivers value!",
  "Ready to transform operations?",
  "Let's standardize for efficiency!",
  "Time to measure and improve!",
  "Your analytics guide decisions!",
  "Ready to benchmark excellence?",
  "Let's integrate for seamless flow!",
  "Time to consolidate resources!",
  "Your governance ensures quality!",
  "Ready to mitigate operational risk?",
  "Let's establish best practices!",
  "Time to document processes!",
  "Your compliance protects value!",
  "Ready to audit for improvement?",
  "Let's validate system integrity!",
  "Time to secure operational assets!",
  "Your monitoring prevents issues!",
  "Ready to troubleshoot efficiently?",
  "Let's maintain service excellence!",
  "Time to support business continuity!",
  "Your resilience ensures stability!",
  "Ready to plan for scalability?",
  "Let's architect for the future!",
  "Time to innovate responsibly!",
  "Your vision shapes tomorrow!",
  "Ready to achieve operational mastery?",
]

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
  }
  return iconMap[iconName] || Wrench // Default to Wrench if icon not found
}

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("")
  const [upliftingMessage, setUpliftingMessage] = useState("")
  const currentUserRole = "Analyst" // Simulate current user as Analyst (not DevOps)

  useEffect(() => {
    setGreeting(getTimeBasedGreeting())
    setUpliftingMessage(getRandomMessage())
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

        const sortedModules =
          data?.sort((a, b) => {
            if (a.status === "active" && b.status !== "active") return -1
            if (a.status !== "active" && b.status === "active") return 1
            return a.sort_order - b.sort_order
          }) || []

        setModules(sortedModules)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
    return "there" // Generic greeting since we're using SSO and no profiles table
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      {/* Updated greeting section with gradient background matching mockup */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800">
        <div className="max-w-screen-xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Good {greeting}, {getUserName()}!
          </h1>
          <p className="text-white/90 max-w-4xl leading-relaxed text-lg">
            Welcome to the <strong>Business Operations Launchpad and Toolkit (BOLT)</strong> — {upliftingMessage}
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-8 py-8 bg-[#F1F5F9] dark:bg-slate-900">
          <QuickLinksHorizontal />

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#14B8A6]" />
              Toolkit
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-40 bg-[#E2E8F0] dark:bg-slate-800 rounded-lg animate-pulse" />
                ))
              : modules.map((module) => {
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
      </main>

      <footer className="bg-[#F1F5F9] dark:bg-slate-900 border-t mt-auto">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#14B8A6] flex items-center justify-center shadow-lg">
                <Wrench className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">© 2024 BOLT. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors hover:underline">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
