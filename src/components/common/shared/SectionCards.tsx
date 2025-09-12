import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 lg:px-6">
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">Total Revenue</CardDescription>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              <IconTrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">$1,250.00</CardTitle>
          <p className="text-xs text-muted-foreground">Trending up this month</p>
        </div>
      </Card>
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">New Customers</CardDescription>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-red-200 text-red-700">
              <IconTrendingDown className="w-3 h-3 mr-1" />
              -20%
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">1,234</CardTitle>
          <p className="text-xs text-muted-foreground">Down 20% this period</p>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">Active Accounts</CardDescription>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              <IconTrendingUp className="w-3 h-3 mr-1" />
              +2
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">45,678</CardTitle>
          <p className="text-xs text-muted-foreground">Strong user retention</p>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">Growth Rate</CardDescription>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              <IconTrendingUp className="w-3 h-3 mr-1" />
              +15.3%
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">4.5%</CardTitle>
          <p className="text-xs text-muted-foreground">Steady performance increase</p>
        </div>
      </Card>
    </div>
  )
}
