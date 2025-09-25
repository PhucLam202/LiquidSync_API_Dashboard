'use client';

import React from 'react';
import { Globe, KeyRound, TrendingUp, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KeyFeaturesProps {
  className?: string;
}

export function KeyFeatures({ className = '' }: KeyFeaturesProps) {
  const features = [
    {
      id: 1,
      title: 'Multi-chain Data',
      description: 'Unified TVL, APY and token metrics across major blockchains.',
      icon: Globe,
      stats: ['12+ Chains', '5 Ecosystems']
    },
    {
      id: 2,
      title: 'API Key & Usage Tracking',
      description: 'Secure API keys with detailed usage dashboards and quota controls.',
      icon: KeyRound,
      stats: ['1.2M+ Requests tracked', 'Rate limit: 500/min']
    },
    {
      id: 3,
      title: 'Real-time Yield Analytics',
      description: 'Track and analyze yield opportunities across multiple DeFi protocols with real-time data updates.',
      icon: TrendingUp,
      stats: ['Average APY: 15.8%', 'Update frequency: 60s']
    },
    {
      id: 4,
      title: 'Developer-first Integration',
      description: 'Clean REST JSON, clear docs, and fast onboarding for devs.',
      icon: Code,
      stats: ['3 SDKs', '99% Uptime']
    }
  ];

  return (
    <section className={`py-16 bg-gray-50/50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful tools and APIs designed for developers building the future of DeFi
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.id}
                className="group bg-white rounded-xl p-6 shadow-lg border border-gray-200 
                         hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out
                         focus-within:shadow-xl focus-within:-translate-y-1.5
                         cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8A66] focus:ring-offset-2
                         h-full flex flex-col"
                tabIndex={0}
                role="button"
                aria-label={`${feature.title}: ${feature.description}`}
              >
                {/* Icon and Title */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 p-3 bg-[#FF8A66]/10 rounded-lg">
                    <IconComponent 
                      className="w-6 h-6 text-[#FF8A66] stroke-[1.5]" 
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {feature.description}
                </p>

                {/* Stat Pills */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {feature.stats.map((stat, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#FF8A66]/10 text-[#FF8A66] hover:bg-[#FF8A66]/20 
                               border-[#FF8A66]/20 px-3 py-1 text-xs font-medium
                               opacity-80 group-hover:opacity-100 
                               translate-y-1 group-hover:translate-y-0 
                               transition-all duration-300 ease-out"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      {stat}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Accessibility note for screen readers */}
        <div className="sr-only">
          This key features section displays 4 cards in a 2x2 grid on desktop, 
          2 cards per row on tablet, and stacks vertically on mobile devices.
        </div>
      </div>
    </section>
  );
}