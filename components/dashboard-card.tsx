"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Wrench, AlertTriangle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  subtitle: string
  enabled: boolean
  status?: "active" | "coming_soon" | "maintenance" | "disabled"
  onClick?: () => void
  className?: string
  icon?: LucideIcon
  gradient?: boolean
  isHero?: boolean
  hasAccess?: boolean
  userRole?: string
  requiredRoles?: string[]
}

export function DashboardCard({
  title,
  subtitle,
  enabled,
  status = "coming_soon",
  onClick,
  className,
  icon: Icon,
  gradient,
  isHero = false,
  hasAccess = true,
  userRole,
  requiredRoles,
}: DashboardCardProps) {
  const getStatusBadge = () => {
    if (!hasAccess && requiredRoles && requiredRoles.length > 0) {
      return {
        icon: AlertTriangle,
        text: "Role Required",
        className:
          "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300",
      }
    }

    switch (status) {
      case "maintenance":
        return {
          icon: Wrench,
          text: "Maintenance",
          className:
            "bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400",
        }
      case "disabled":
        return {
          icon: Lock,
          text: "Disabled",
          className: "bg-red-100 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
        }
      default:
        return {
          icon: Lock,
          text: "Coming Soon",
          className: "bg-muted/80 border-muted text-muted-foreground/70",
        }
    }
  }

  const statusBadge = getStatusBadge()
  const isEnabled = enabled && hasAccess

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover-lift group relative overflow-hidden min-h-44 flex flex-col",
        isEnabled
          ? "border-accent/20 hover:border-accent/60 cursor-pointer hover:shadow-xl"
          : "coming-soon-blur bg-[#E2E8F0] dark:bg-slate-800 border-muted/50 cursor-default border-dashed",
        !hasAccess &&
          "grayscale-0 opacity-90 border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/10 relative",
        gradient && isEnabled && "animated-gradient border-0",
        isHero && isEnabled && "hero-glow border-accent/40 bg-gradient-to-br from-accent/5 to-accent/10",
        className,
      )}
      onClick={isEnabled ? onClick : undefined}
    >
      {gradient && isEnabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70" />
      )}

      {!hasAccess && (
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-500/20 to-transparent transform rotate-45 scale-150"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-500/10 to-transparent transform -rotate-45 scale-150"></div>
        </div>
      )}

      {!isEnabled && (
        <div className="absolute top-2 right-2 z-20">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm border",
              statusBadge.className,
            )}
          >
            <statusBadge.icon className="h-3 w-3" />
            <span className="text-xs font-medium">{statusBadge.text}</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-2 pt-3 px-4 relative z-10 flex-grow">
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className={cn(
                "p-2 rounded-lg transition-all duration-300 flex-shrink-0",
                isEnabled
                  ? isHero
                    ? "bg-[#4F46E5]/20 text-[#4F46E5] group-hover:bg-[#14B8A6]/30 group-hover:text-[#14B8A6] group-hover:scale-110 shadow-lg"
                    : "bg-[#4F46E5]/10 text-[#4F46E5] group-hover:bg-[#14B8A6]/20 group-hover:text-[#14B8A6] group-hover:scale-110"
                  : hasAccess
                    ? "bg-muted/50 text-muted-foreground/50"
                    : "bg-orange-100 text-orange-400 dark:bg-orange-900/30 dark:text-orange-500",
                gradient && isEnabled && "bg-white/20 text-white",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle
              className={cn(
                "text-lg font-bold transition-colors duration-300 leading-tight",
                isEnabled
                  ? isHero
                    ? "text-[#4F46E5] group-hover:text-[#14B8A6]"
                    : "text-[#4F46E5] group-hover:text-[#14B8A6]"
                  : hasAccess
                    ? "text-muted-foreground/60"
                    : "text-orange-600 dark:text-orange-400",
                gradient && isEnabled && "text-white dark:text-gray-100",
              )}
            >
              {title}
            </CardTitle>
            <CardDescription
              className={cn(
                "text-xs mt-1 leading-relaxed line-clamp-2",
                isEnabled
                  ? "text-muted-foreground"
                  : hasAccess
                    ? "text-muted-foreground/50"
                    : "text-orange-500/70 dark:text-orange-400/70",
                gradient && isEnabled && "text-white/80 dark:text-gray-200/80",
              )}
            >
              {!hasAccess && requiredRoles && requiredRoles.length > 0
                ? `Requires ${requiredRoles.join(" or ")} role access`
                : subtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3 px-4 relative z-10 flex-shrink-0">
        <Button
          variant={gradient ? "secondary" : "default"}
          size="xs"
          className={cn(
            "transition-all duration-300 font-medium text-xs w-full h-8 whitespace-normal leading-tight",
            gradient
              ? "bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50"
              : isEnabled
                ? "bg-[#4F46E5] hover:bg-[#14B8A6] text-white shadow-lg hover:shadow-xl border-0 transition-colors duration-300"
                : hasAccess
                  ? "bg-[#E2E8F0] dark:bg-slate-700 text-muted-foreground cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 cursor-not-allowed border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
          )}
          disabled={!isEnabled}
        >
          {isEnabled ? "Launch" : hasAccess ? "Coming Soon" : "Access Denied"}
        </Button>
      </CardContent>
    </Card>
  )
}
