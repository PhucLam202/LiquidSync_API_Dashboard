import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { SimpleOverview } from "@/features/profile/components/simple-overview"
import { SimpleSettings } from "@/features/profile/components/simple-settings"

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-6">
      {/* Simplified Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Separator className="my-8" />
      
      {/* Profile Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-sm grid-cols-2 h-10 bg-peach-light border border-border">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all duration-200"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
          <SimpleOverview />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 animate-in fade-in-50 duration-300">
          <SimpleSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
