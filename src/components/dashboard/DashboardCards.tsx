import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DashboardCards() {
  const stats = [
    {
      title: "Total Value Locked",
      value: "$2.4M",
      description: "Across all protocols",
      change: "+12.5%"
    },
    {
      title: "Portfolio Value",
      value: "$45,231",
      description: "Your current holdings",
      change: "+8.2%"
    },
    {
      title: "Active Positions",
      value: "8",
      description: "Across 4 protocols",
      change: "+2"
    },
    {
      title: "Yield Earned",
      value: "$1,234",
      description: "This month",
      change: "+15.3%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <CardDescription className="flex items-center justify-between">
              <span>{stat.description}</span>
              <span className="text-green-600 text-sm font-medium">
                {stat.change}
              </span>
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common DeFi operations you can perform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-12">
            Swap Tokens
          </Button>
          <Button variant="outline" className="h-12">
            Add Liquidity
          </Button>
          <Button variant="outline" className="h-12">
            Stake Assets
          </Button>
          <Button variant="outline" className="h-12">
            View Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}