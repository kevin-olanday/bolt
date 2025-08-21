import { Zap } from "lucide-react"
import type { ModuleConfig } from "./index"

export const sprintPassModule: ModuleConfig = {
  name: "sprint_pass",
  title: "Sprint Pass",
  description:
    "Developer season pass for sprint management, deployment tracking, and development workflow optimization",
  icon: Zap,
  status: "active",
  buttonText: "Launch",
  onClick: () => {
    // TODO: Navigate to sprint pass page when implemented
    console.log("Sprint Pass clicked")
  },
}
