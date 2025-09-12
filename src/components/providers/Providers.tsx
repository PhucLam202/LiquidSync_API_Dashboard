'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/contexts/auth-context';
import type { Config } from 'wagmi';

// Dynamic imports to prevent SSR issues
const WagmiProvider = dynamic(
  () => import('wagmi').then((mod) => ({ default: mod.WagmiProvider })),
  { ssr: false }
);

const RainbowKitProvider = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => ({ default: mod.RainbowKitProvider })),
  { ssr: false }
);

const Web3DisconnectHandler = dynamic(
  () => import('@/features/auth/components/Web3DisconnectHandler').then((mod) => ({ default: mod.Web3DisconnectHandler })),
  { ssr: false }
);


// Create a stable query client instance
let queryClientSingleton: QueryClient | undefined

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
        // Prevent automatic retries during SSR
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  })
}

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!queryClientSingleton) queryClientSingleton = createQueryClient()
    return queryClientSingleton
  }
}

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [config, setConfig] = React.useState<Config | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rainbowTheme, setRainbowTheme] = React.useState<any>(null);
  const queryClient = getQueryClient();

  React.useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      Promise.all([
        import('@/services/web3/wagmi.service'),
        import('@rainbow-me/rainbowkit')
      ]).then(([wagmiModule, rainbowKitModule]) => {
        setConfig(wagmiModule.config);
        
        // Configure custom themes with peach/pink color scheme
        const customTheme = {
          lightMode: rainbowKitModule.lightTheme({
            accentColor: '#FF6B6B',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          }),
          darkMode: rainbowKitModule.darkTheme({
            accentColor: '#FF8E8E',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          }),
        };
        
        setRainbowTheme(customTheme);
        setMounted(true);
      });
    }
  }, []);

  // During SSR or before config loads, just render children without Web3 providers
  if (!mounted || !config || !rainbowTheme || typeof window === 'undefined') {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={rainbowTheme}
            modalSize="compact"
            initialChain={config.chains[0]}
            showRecentTransactions={true}
          >
            <Web3DisconnectHandler />
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AuthProvider>
  );
}
