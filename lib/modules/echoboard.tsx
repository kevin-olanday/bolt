import { MessageSquare } from "lucide-react"
import type { ModuleConfig } from "./index"

export const echoboardModule: ModuleConfig = {
  name: "echoboard",
  title: "Echoboard 2.0",
  description: "Collect team feedback",
  icon: MessageSquare,
  status: "coming_soon",
  buttonText: "Open Board",
  onClick: () => {
    console.log("Opening Echoboard...")
  },
}
