import { Header } from '@/components/common/layout/Header';
import { DashboardCards } from '@/features/dashboard/components/DashboardCards';
import { Hero } from '@/components/common/sections/Hero';
import { Footer } from '@/components/common/sections/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TrendingUp, Shield, Network } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to LiquidSync
          </h2>
          <p className="text-muted-foreground">
            Unified DeFi platform for liquid staking analytics and smart yield optimization
          </p>
        </div>

        <Separator className="my-8" />

        {/* Key Features Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Real-time Yield Analytics */}
            <Card className="backdrop-blur-sm bg-white/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                  <TrendingUp size={48} className="text-primary" />
                </div>
                <CardTitle className="text-lg">Real-time Yield Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center">
                  Track and analyze yield opportunities across multiple DeFi protocols with real-time data updates.
                </CardDescription>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Average APY: 15.8%</Badge>
                  <Badge variant="secondary">Update frequency: 60s</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Secure Token Conversion */}
            <Card className="backdrop-blur-sm bg-white/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                  <Shield size={48} className="text-primary" />
                </div>
                <CardTitle className="text-lg">Secure Token Conversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center">
                  Convert tokens safely with multiple security layers and minimal slippage protection.
                </CardDescription>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Security layers: 11</Badge>
                  <Badge variant="outline">Max slippage: 0.5%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Protocol Support */}
            <Card className="backdrop-blur-sm bg-white/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                  <Network size={48} className="text-primary" />
                </div>
                <CardTitle className="text-lg">Multi-Protocol Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center">
                  Access multiple blockchain networks and protocols from a single unified interface.
                </CardDescription>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge>Supported networks: 6</Badge>
                  <Badge>vTokens available: 11+</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Dashboard Stats */}
        <DashboardCards />

        <Separator className="my-8" />

        {/* FAQ Section */}
        <div className="mb-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-950/20 dark:via-background dark:to-orange-900/20 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/30">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground">
              Everything you need to know about LiquidSync and liquid staking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Technical Questions */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary">Technical & API</h4>
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="item-1" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    What is liquid staking and how do vTokens work?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Liquid staking allows you to stake your tokens while maintaining liquidity through vTokens (voucher tokens). When you stake DOT, you receive vDOT in return, which represents your staked position and can be freely traded or used in DeFi protocols while still earning staking rewards.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    How does the 11-layer security validation work?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our security system validates each transaction through multiple checkpoints including: token pair verification, amount boundaries, slippage limits, rate oracle checks, network status validation, smart contract verification, liquidity depth analysis, price impact calculation, MEV protection, duplicate transaction prevention, and final execution validation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    What&apos;s the API rate limit and how to increase it?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The default rate limit is 100 requests per 15 minutes per IP address. For production applications requiring higher limits, you can request an API key through our Dashboard which provides up to 1000 requests per 15 minutes. Enterprise solutions with custom limits are also available.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    Which networks and tokens are currently supported?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    LiquidSync supports 6 networks (Bifrost, Moonbeam, Astar, Hydration, PolkaDX, Moonriver) and 11+ vTokens including vDOT, vKSM, vETH, vBNC, vASTR, vMANTA, vFIL, vPHA, vMOVR, and vGLMR. We continuously add new tokens based on community demand.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Right Column - General Questions */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary">Usage & General</h4>
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="item-5" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    How accurate is the APY data displayed?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our APY data is updated every 60 seconds directly from on-chain sources and official protocol APIs. The displayed rates reflect real-time staking rewards minus validator fees, giving you the most accurate yield information available.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    Is there a minimum amount for token conversion?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Minimum conversion amounts vary by token pair but typically start from 0.1 units of the base token. The converter will automatically display minimum and maximum amounts based on current liquidity and network conditions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    How do I connect my wallet and start using the dashboard?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Click the &apos;Dashboard&apos; button in the header to access the full application. We support major wallets including MetaMask, Polkadot.js, and WalletConnect. Once connected, you&apos;ll have access to portfolio tracking, yield analytics, and token conversion features.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">
                    What makes LiquidSync different from other DeFi platforms?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    LiquidSync specializes in liquid staking analytics with real-time data aggregation from multiple protocols, advanced security features, and a unified API for developers. Our focus on vTokens and staking yields provides deeper insights than general DeFi platforms.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
