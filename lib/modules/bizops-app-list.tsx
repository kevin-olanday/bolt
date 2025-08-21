import { List } from "lucide-react"
import type { ModuleConfig } from "./index"

export const bizopsAppListModule: ModuleConfig = {
  name: "bizops_app_list",
  title: "BizOps App List",
  description: "Directory of business apps",
  icon: List,
  status: "active", // Changed from coming_soon to active
  buttonText: "Launch",
  onClick: () => {
    window.location.href = "/bizops-app-list"
  },
}
