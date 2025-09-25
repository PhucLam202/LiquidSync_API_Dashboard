// Chart-specific types and configurations

export type ChartType = 'categories' | 'top-protocols' | 'growth-trends' | 'chain-distribution';

export interface ChartConfig {
  id: ChartType;
  name: string;
  type: 'donut' | 'bar' | 'scatter' | 'treemap';
  description: string;
  icon: string;
}

export interface ChartOption {
  value: ChartType;
  label: string;
  description: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

// Color schemes for different categories
export const CATEGORY_COLORS: Record<string, string> = {
  'CEX': '#FF8A66',
  'Lending': '#4F46E5',
  'Liquid Staking': '#059669',
  'DEX': '#DC2626',
  'Bridge': '#7C3AED',
  'Restaking': '#EA580C',
  'CDP': '#0891B2',
  'Yield': '#65A30D',
  'Basis Trading': '#BE185D',
  'Liquid Restaking': '#0D9488',
  'Canonical Bridge': '#7C2D12',
  'Derivatives': '#B91C1C',
  'Onchain Capital Allocator': '#1D4ED8',
  'default': '#6B7280'
};

// Chart dimensions and responsive breakpoints
export interface ChartDimensions {
  width: string | number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const CHART_DIMENSIONS: Record<string, ChartDimensions> = {
  desktop: {
    width: '100%',
    height: 400,
    margin: { top: 20, right: 30, bottom: 40, left: 40 }
  },
  tablet: {
    width: '100%',
    height: 350,
    margin: { top: 20, right: 20, bottom: 40, left: 30 }
  },
  mobile: {
    width: '100%',
    height: 300,
    margin: { top: 20, right: 10, bottom: 40, left: 20 }
  }
};

// Animation configurations
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export const CHART_ANIMATIONS: Record<string, AnimationConfig> = {
  enter: { duration: 750, easing: 'ease-out' },
  update: { duration: 500, easing: 'ease-in-out' },
  exit: { duration: 300, easing: 'ease-in' }
};