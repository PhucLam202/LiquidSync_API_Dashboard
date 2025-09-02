import { InProcessPage } from "@/components/in-process-page"

export default function ProjectsPage() {
  return (
    <InProcessPage 
      title="Project Management"
      description="Organize and manage your projects efficiently"
      expectedFeatures={[
        "Project creation & editing",
        "Task management",
        "Team collaboration",
        "File sharing",
        "Progress tracking",
        "Deadline management"
      ]}
    />
  )
}