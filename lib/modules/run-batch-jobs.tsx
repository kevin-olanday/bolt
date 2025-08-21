import { Play } from "lucide-react"
import type { ModuleConfig } from "./index"

export const runBatchJobsModule: ModuleConfig = {
  name: "run_batch_jobs",
  title: "Run Batch Jobs",
  description: "Execute automated batch processes",
  icon: Play,
  status: "coming_soon",
  buttonText: "Run Jobs",
  onClick: () => {
    console.log("Run Batch Jobs clicked")
    // TODO: Implement batch jobs functionality
  },
}
