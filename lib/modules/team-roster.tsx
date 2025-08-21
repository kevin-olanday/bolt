import { Users } from "lucide-react"
import type { ModuleConfig } from "./index"

export const teamRosterModule: ModuleConfig = {
  name: "team_roster",
  title: "Team Roster",
  description: "View team contacts",
  icon: Users,
  status: "active",
  buttonText: "Open Roster",
  onClick: () => {
    console.log("[v0] Team Roster functionality coming soon")
  },
}
