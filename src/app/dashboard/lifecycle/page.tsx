import { InProcessPage } from "@/components/common/shared/InProcessPage"

export default function LifecyclePage() {
  return (
    <InProcessPage 
      title="Lifecycle Management"
      description="Manage your project lifecycles and development stages"
      expectedFeatures={[
        "Project stage tracking",
        "Lifecycle analytics", 
        "Stage transitions",
        "Timeline visualization",
        "Milestone management",
        "Progress monitoring"
      ]}
    />
  )
}