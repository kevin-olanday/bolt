import type { LucideIcon } from "lucide-react"

export interface Module {
  id: string
  name: string
  title: string
  description: string
  icon: string
  status: "active" | "coming_soon" | "maintenance" | "disabled"
  sort_order: number
  button_text: string | null
  button_action: string | null
}

export interface ModuleConfig {
  name: string
  title: string
  description: string
  icon: LucideIcon
  status: "active" | "coming_soon" | "maintenance" | "disabled"
  buttonText?: string
  onClick?: () => void
  isHero?: boolean
}

export type { ModuleConfig as ModuleConfigType }
