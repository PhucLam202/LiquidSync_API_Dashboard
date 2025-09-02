import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import data from "./data.json"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      {/* Alert Cards - Better color scheme */}
      <SectionCards />
      
      {/* Chart Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Total Visitors</CardTitle>
              <CardDescription>Total for the last 3 months</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Last 3 months
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Last 30 days
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Last 7 days
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartAreaInteractive />
        </CardContent>
      </Card>
      
      {/* Data Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Track your project progress and performance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="outline" className="w-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="performance">Past Performance</TabsTrigger>
                  <TabsTrigger value="documents">Focus Documents</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button>
                <span className="mr-2">+</span>
                Add Section
              </Button>
              <Button variant="outline">
                <span className="mr-2">⚙</span>
                Customize Columns
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={data} />
        </CardContent>
      </Card>
    </div>
  )
}
