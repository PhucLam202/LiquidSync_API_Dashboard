import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Web3Providers } from "@/components/providers/Providers";
import { ErrorBoundary, setupGlobalErrorHandling } from "@/components/common/shared/ErrorBoundary";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

// Setup global error handling for unhandled promises
if (typeof window !== 'undefined') {
  setupGlobalErrorHandling();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LiquidSync",
  description: "Modern financial dashboard with beautiful Peach Fuzz color scheme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="liquidsync-theme"
        >
          <ErrorBoundary>
            <Web3Providers>
              {children}
              <Toaster />
            </Web3Providers>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
