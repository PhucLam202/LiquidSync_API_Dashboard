import { InProcessPage } from "@/components/in-process-page"

export default function TeamPage() {
  return (
    <InProcessPage 
      title="Team Management"
      description="Manage your team members and permissions"
      expectedFeatures={[
        "Team member directory",
        "Role & permission management", 
        "Team performance metrics",
        "Communication tools",
        "Activity tracking",
        "Team collaboration spaces"
      ]}
    />
  )
}