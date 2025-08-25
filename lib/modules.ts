export interface ModuleConfig {
  name: string
  title: string
  description: string
  icon: string
  path: string
  status: "active" | "coming_soon" | "maintenance" | "disabled"
  isHero?: boolean
}

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
  visible_to_roles?: string[] | null
}

export const moduleConfigs: Record<string, ModuleConfig> = {
  productivity_tracker: {
    name: "productivity_tracker",
    title: "Productivity Tracker",
    description: "Track daily metrics",
    icon: "BarChart3",
    path: "/productivity-tracker",
    status: "active"
  },
  bizops_app_list: {
    name: "bizops_app_list",
    title: "BizOps App List",
    description: "Directory of business apps",
    icon: "List",
    path: "/bizops-app-list",
    status: "active"
  },
  team_roster: {
    name: "team_roster",
    title: "Team Roster",
    description: "Manage team members",
    icon: "Users",
    path: "/team-roster",
    status: "coming_soon"
  },
  attendance: {
    name: "attendance",
    title: "Attendance",
    description: "Track daily attendance and leave management",
    icon: "Calendar",
    path: "/attendance",
    status: "active"
  },
  compare_access: {
    name: "compare_access",
    title: "Compare Access",
    description: "Compare access rights",
    icon: "Shield",
    path: "/compare-access",
    status: "coming_soon"
  },
  dashboards: {
    name: "dashboards",
    title: "Dashboards",
    description: "View dashboards",
    icon: "LineChart",
    path: "/dashboards",
    status: "coming_soon"
  },
  echoboard: {
    name: "echoboard",
    title: "Echoboard",
    description: "Echo board",
    icon: "MessageSquare",
    path: "/echoboard",
    status: "coming_soon"
  },
  boss_academy: {
    name: "boss_academy",
    title: "BOSS Academy",
    description: "BOSS Academy",
    icon: "GraduationCap",
    path: "/boss-academy",
    status: "coming_soon"
  },
  run_batch_jobs: {
    name: "run_batch_jobs",
    title: "Run Batch Jobs",
    description: "Run batch jobs",
    icon: "Grid3X3",
    path: "/run-batch-jobs",
    status: "coming_soon"
  },
  skills_matrix: {
    name: "skills_matrix",
    title: "Skills Matrix",
    description: "Skills matrix",
    icon: "Wrench",
    path: "/skills-matrix",
    status: "coming_soon"
  },
  sprint_pass: {
    name: "sprint_pass",
    title: "Sprint Pass",
    description: "Sprint pass",
    icon: "MessageCircle",
    path: "/sprint-pass",
    status: "coming_soon"
  },
  safe_paste: {
    name: "safe_paste",
    title: "Safe Paste",
    description: "Securely share text snippets and code",
    icon: "FileLock",
    path: "/safe-paste",
    status: "active"
  }
}

// Helper function to get module config by name
export const getModuleConfig = (moduleName: string): ModuleConfig | undefined => {
  return moduleConfigs[moduleName]
}
