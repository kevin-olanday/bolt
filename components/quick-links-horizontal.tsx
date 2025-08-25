"use client"
import {
  Globe,
  Shield,
  Wrench,
  Share2,
  BookOpen,
  Bug,
  TriangleIcon as Trident,
  BarChart3,
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
      <div className="text-center py-8 text-muted-foreground">
        <p>{error}</p>
        <p className="text-sm mt-2">Please check your database connection.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted/20 rounded-lg animate-pulse" />
          ))
        : quickLinks.map((link) => {
            const IconComponent = iconMap[link.icon] || Globe
            const colorClass =
              colorMap[link.category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

            return (
              <a
                key={link.id}
                href={link.url}
                className={`block p-3 flex items-center gap-3 hover:scale-[1.02] transition-transform cursor-pointer rounded-lg ${colorClass}`}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium leading-tight whitespace-nowrap">
                  {link.title}
                </span>
              </a>
            )
          })}
    </div>
  )
}
