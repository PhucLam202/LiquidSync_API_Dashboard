import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required. Please add it to your .env.local file'
  );
}


export const config = getDefaultConfig({
  appName: 'LiquidSync DeFi',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: false, // Changed to false for better compatibility
});
