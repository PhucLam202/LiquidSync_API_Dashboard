import React from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">DeFi Frontend</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Portfolio
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Trading
          </a>
        </nav>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}