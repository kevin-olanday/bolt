import { GraduationCap } from "lucide-react"
import type { ModuleConfig } from "./index"

export const bossAcademyModule: ModuleConfig = {
  name: "boss_academy",
  title: "BOSS Academy",
  description: "Access comprehensive training modules and skill development resources for BizOps excellence",
  icon: GraduationCap,
  status: "coming_soon",
  onClick: () => {
    console.log("BOSS Academy clicked - Coming Soon!")
  },
}
