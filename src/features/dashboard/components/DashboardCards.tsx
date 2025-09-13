'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardCards() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total Value Locked",
      value: "$0",
      description: "From /api/v1/bifrost/yields",
      change: "0%",
      api: "/api/v1/bifrost/yields"
    },
    {
      title: "Portfolio Value",
      value: "$0",
      description: "Aggregated vTokens value",
      change: "0%",
      api: "user_vtokens_aggregate"
    },
    {
      title: "Active Positions",
      value: "0",
      description: "Supported tokens count",
      change: "+0",
      api: "supported_tokens_count"
    },
    {
      title: "Yield Earned",
      value: "$0",
      description: "Calculated from APY data",
      change: "0%",
      api: "apy_calculations"
    }
  ]);

  useEffect(() => {
    // Simulate API call with loading state
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update with mock data (replace with actual API calls)
      setStats([
        {
          title: "Total Value Locked",
          value: "$2.4M",
          description: "From /api/v1/bifrost/yields",
          change: "+12.5%",
          api: "/api/v1/bifrost/yields"
        },
        {
          title: "Portfolio Value",
          value: "$45,231",
          description: "Aggregated vTokens value",
          change: "+8.2%",
          api: "user_vtokens_aggregate"
        },
        {
          title: "Active Positions",
          value: "8",
          description: "Supported tokens count",
          change: "+2",
          api: "supported_tokens_count"
        },
        {
          title: "Yield Earned",
          value: "$1,234",
          description: "Calculated from APY data",
          change: "+15.3%",
          api: "apy_calculations"
        }
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {loading ? <Skeleton className="h-4 w-3/4" /> : stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <CardDescription className="flex items-center justify-between">
                  <span>{stat.description}</span>
                  <span className="text-green-600 text-sm font-medium">
                    {stat.change}
                  </span>
                </CardDescription>
              </>
            )}
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
          Essential DeFi operations for liquid staking and yield optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default" size="lg" className="h-14 flex flex-col items-center justify-center">
            <span className="font-semibold">Convert vTokens</span>
            <span className="text-xs opacity-80">Liquid staking</span>
          </Button>
          <Button variant="secondary" size="lg" className="h-14 flex flex-col items-center justify-center">
            <span className="font-semibold">Stake Assets</span>
            <span className="text-xs opacity-80">Earn rewards</span>
          </Button>
          <Button variant="outline" size="lg" className="h-14 flex flex-col items-center justify-center">
            <span className="font-semibold">Calculate Yields</span>
            <span className="text-xs opacity-80">APY calculator</span>
          </Button>
          <Button variant="ghost" size="lg" className="h-14 flex flex-col items-center justify-center">
            <span className="font-semibold">API Explorer</span>
            <span className="text-xs opacity-80">Developers</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}