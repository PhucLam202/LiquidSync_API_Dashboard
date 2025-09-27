import React from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Github, Twitter } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">LiquidSync</h1>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="#" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                Features
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="https://liquidsync.up.railway.app/docs" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                API Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="https://twitter.com/liquidsync" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-gray-900 transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Follow us on Twitter</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="https://github.com/PhucLam202" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <Button 
            variant="default" 
            size="sm" 
            asChild
            className="hover:bg-primary/80 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
          >
            <a 
              href="https://liquid-sync-api-dashboard.vercel.app/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              Dashboard
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}