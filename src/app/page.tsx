import { Header } from '@/components/common/layout/Header';
import { DashboardCards, QuickActions } from '@/features/dashboard/components/DashboardCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to LiquidSync
          </h2>
          <p className="text-muted-foreground">
            Your modern financial dashboard with beautiful Peach Fuzz design
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardCards />

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Demo Components Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Component Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui Components Demo</CardTitle>
              <CardDescription>
                Examples of integrated shadcn/ui components with TailwindCSS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sample Input</label>
                <Input placeholder="Enter your wallet address..." />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>LiquidSync Setup Complete! 🎉</CardTitle>
              <CardDescription>
                Modern financial dashboard with Peach Fuzz theme ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Next.js 15</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">React 19</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">TailwindCSS v4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">shadcn/ui</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Turbopack</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Ready to start developing:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  npm run dev
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
