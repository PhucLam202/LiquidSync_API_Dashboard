import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex-1 p-0">
            <div className="flex h-16 items-center px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome to your dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}