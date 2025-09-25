'use client';

import React from 'react';
import { Globe, KeyRound, TrendingUp, Code } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturesBlockProps {
  loading?: boolean;
}

export function FeaturesBlock({ loading = false }: FeaturesBlockProps) {
  const features = [
    {
      id: 1,
      title: 'Multi-chain Data',
      description: 'Unified TVL, APY and token metrics across major blockchains.',
      icon: Globe,
      highlighted: false
    },
    {
      id: 2,
      title: 'API Key & Usage Tracking',
      description: 'Secure API keys with detailed usage dashboards and quota controls.',
      icon: KeyRound,
      highlighted: true
    },
    {
      id: 3,
      title: 'Real-time TVL Analytics',
      description: 'Live Total Value Locked across protocols and ecosystems.',
      icon: TrendingUp,
      highlighted: false
    },
    {
      id: 4,
      title: 'Developer-first Integration',
      description: 'Clean REST JSON, clear docs, and fast onboarding for devs.',
      icon: Code,
      highlighted: false
    }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <div
                key={feature.id}
                className={`
                  group relative bg-white rounded-xl p-6 shadow-lg border transition-all duration-[220ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]
                  hover:-translate-y-1.5 hover:shadow-xl focus-within:-translate-y-1.5 focus-within:shadow-xl
                  cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8A66] focus:ring-offset-2
                  ${feature.highlighted 
                    ? 'border-[#FF8A66] shadow-[0_0_0_1px_rgba(255,138,102,0.18)]' 
                    : 'border-gray-200 hover:border-[#FF8A66]/30'
                  }
                `}
                tabIndex={0}
                role="button"
                aria-label={`${feature.title}: ${feature.description}`}
              >
                {/* Icon and Title Row */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <IconComponent 
                      className="w-8 h-8 text-[#FF8A66] stroke-[1.5]" 
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlight glow effect for featured card */}
                {feature.highlighted && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF8A66]/5 via-transparent to-[#FF8A66]/5 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Responsive grid explanation for screen readers */}
        <div className="sr-only">
          This features grid shows 4 columns on desktop, 2 columns on tablet, and stacks vertically on mobile devices.
        </div>
      </div>
    </section>
  );
}