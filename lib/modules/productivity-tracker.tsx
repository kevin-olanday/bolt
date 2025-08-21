import { BarChart3 } from "lucide-react"
import type { ModuleConfig } from "./index"

export const productivityTrackerModule: ModuleConfig = {
  name: "productivity_tracker",
  title: "Productivity Tracker",
  description: "Track daily metrics",
  icon: BarChart3,
  status: "active", // Changed from coming_soon to active
  onClick: () => {
    window.location.href = "/productivity-tracker" // Added navigation to productivity tracker page
  },
}
