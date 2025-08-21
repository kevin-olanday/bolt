"use client"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Shield,
  Wrench,
  Share2,
  BookOpen,
  Bug,
  TriangleIcon as Trident,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface QuickLink {
  id: number
  title: string
  url: string
  icon: string
  category: string
  description: string
}

const iconMap: Record<string, any> = {
  Globe,
  Shield,
  Wrench,
  Share2,
  BookOpen,
  Bug,
  Trident,
  BarChart3,
}

const colorMap: Record<string, string> = {
  Portal: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Platform: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Dashboard: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Collaboration: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Project Management": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "Knowledge Base": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Ticketing: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export function QuickLinksHorizontal() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuickLinks() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("quick_links").select("*").order("sort_order", { ascending: true })

        if (error) {
          console.error("[v0] Error fetching quick links:", error)
          setError("Failed to fetch quick links")
          return
        }

        setQuickLinks(data || [])
      } catch (error) {
        console.error("[v0] Error creating Supabase client or fetching quick links:", error)
        setError("Failed to connect to database")
      } finally {
        setLoading(false)
      }
    }

    fetchQuickLinks()
  }, [])

  if (error) {
    return (
      <div className="bg-white dark:bg-card rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>{error}</p>
          <p className="text-sm mt-2">Please check your database connection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
        >
          <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        {/* <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button> */}
      </div>

      {isExpanded && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 h-20 w-[130px] bg-muted/20 rounded-lg animate-pulse" />
              ))
            : quickLinks.map((link) => {
                const IconComponent = iconMap[link.icon] || Globe
                const colorClass =
                  colorMap[link.category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

                return (
                  <Button
                    key={link.id}
                    variant="ghost"
                    className={`flex-shrink-0 h-auto p-3 flex flex-col items-center gap-2 min-w-[130px] hover:scale-105 transition-transform ${colorClass}`}
                    asChild
                  >
                    <a href={link.url}>
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs font-medium text-center leading-tight whitespace-normal">
                        {link.title}
                      </span>
                    </a>
                  </Button>
                )
              })}
        </div>
      )}
    </div>
  )
}
