import { Header } from '@/components/common/layout/Header';
import { Hero } from '@/components/common/sections/Hero';
import { KeyFeatures } from '@/components/common/sections/KeyFeatures';
import EnhancedLiveDataPreview from '@/components/common/sections/LiveDataPreview/components/EnhancedLiveDataPreview';
import { Footer } from '@/components/common/sections/Footer';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Key Features */}
      <KeyFeatures />
      
      {/* Enhanced Live Data Preview */}
      <EnhancedLiveDataPreview />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          
        </div>


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
