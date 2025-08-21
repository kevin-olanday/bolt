import { Grid3X3 } from "lucide-react"
import type { ModuleConfig } from "./index"

export const skillsMatrixModule: ModuleConfig = {
  name: "skills_matrix",
  title: "Skills Matrix",
  description: "Visualize team competencies and identify skill gaps across different domains and technologies",
  icon: Grid3X3,
  status: "coming_soon",
  onClick: () => {
    console.log("Skills Matrix clicked - Coming Soon!")
  },
}
