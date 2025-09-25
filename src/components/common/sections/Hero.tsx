'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Network, BarChart3 } from 'lucide-react';

export function Hero() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  return (
    <section className="relative min-h-[600px] overflow-hidden">
      {/* Background Gradient with Network Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100/50 dark:from-orange-950/10 dark:via-background dark:to-orange-900/10">
        {/* Geometric Network Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-orange-300 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-orange-300 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-32 w-16 h-16 border border-orange-300 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-orange-300 rounded-lg"></div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Animated Headline */}
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 ${
                isAnimated 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              Multi-chain DeFi{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Data API
              </span>{' '}
              & Dashboard
            </h1>

            {/* Subheadline */}
            <p 
              className={`text-xl text-muted-foreground mb-8 max-w-2xl transition-all duration-1000 delay-200 ${
                isAnimated 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              Secure API keys, usage tracking, and real-time TVL & yield data across major blockchain ecosystems.
            </p>

            {/* CTAs */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-400 ${
                isAnimated 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold group transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get API Key
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-105"
              >
                Launch Dashboard
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* API Hub Illustration */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-200/50">
                {/* Blockchain Nodes */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Network className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Ethereum</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500/50 to-orange-500/50"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Network className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Polygon</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-500/50 to-orange-500/50"></div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Network className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Arbitrum</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500/50 to-orange-500/50"></div>
                  </div>
                </div>

                {/* API Hub Center */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-600">DASHBOARD</span>
                    <BarChart3 className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gradient-to-r from-orange-500/80 to-orange-300/80 rounded w-3/4"></div>
                    <div className="h-2 bg-gradient-to-r from-blue-500/80 to-blue-300/80 rounded w-1/2"></div>
                    <div className="h-2 bg-gradient-to-r from-green-500/80 to-green-300/80 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-500 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}