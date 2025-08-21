import type { LucideIcon } from "lucide-react"
import { teamRosterModule } from "./team-roster"
import { productivityTrackerModule } from "./productivity-tracker"
import { attendanceModule } from "./attendance"
import { compareAccessModule } from "./compare-access"
import { bizopsAppListModule } from "./bizops-app-list"
import { dashboardsModule } from "./dashboards"
import { echoboardModule } from "./echoboard"
import { bossAcademyModule } from "./boss-academy"
import { runBatchJobsModule } from "./run-batch-jobs"
import { skillsMatrixModule } from "./skill-matrix"
import { sprintPassModule } from "./sprint-pass"

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

export const moduleRegistry: Record<string, ModuleConfig> = {
  team_roster: teamRosterModule,
  productivity_tracker: productivityTrackerModule,
  attendance: attendanceModule,
  compare_access: compareAccessModule,
  bizops_app_list: bizopsAppListModule,
  dashboards: dashboardsModule,
  echoboard: echoboardModule,
  boss_academy: bossAcademyModule,
  run_batch_jobs: runBatchJobsModule,
  skills_matrix: skillsMatrixModule,
  sprint_pass: sprintPassModule,
}

export {
  teamRosterModule,
  productivityTrackerModule,
  attendanceModule,
  compareAccessModule,
  bizopsAppListModule,
  dashboardsModule,
  echoboardModule,
  bossAcademyModule,
  runBatchJobsModule,
  skillsMatrixModule,
  sprintPassModule,
}
