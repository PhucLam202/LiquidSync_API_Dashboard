import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/dashboard/components/AppSidebar"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import { WalletInfo } from "@/features/auth/components/WalletInfo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex-1 p-0">
              <div className="flex h-16 items-center px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    Welcome to your dashboard
                  </span>
                  <WalletInfo />
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  )
}