'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Twitter, MessageCircle, ArrowRight } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'API', href: '/api' },
      { label: 'Explorer', href: '/explorer' },
      { label: 'SDKs', href: '/sdks' }
    ],
    docs: [
      { label: 'Quickstart', href: '/docs/quickstart' },
      { label: 'Endpoints', href: '/docs/endpoints' },
      { label: 'Rate Limits', href: '/docs/rate-limits' }
    ],
    community: [
      { label: 'GitHub', href: 'https://github.com/PhucLam202' },
      { label: 'Discord', href: '#' },
      { label: 'Twitter', href: 'https://twitter.com/liquidsync' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' }
    ]
  };

  return (
    <footer className="bg-[#13202A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Left: Logo and Tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-2xl font-bold">LiquidSync</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Multi-chain DeFi data API and analytics platform for developers building the next generation of financial applications.
            </p>
          </div>

          {/* Middle: Link Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Product Column */}
            <div>
              <h4 className="font-semibold mb-3 text-white">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Docs Column */}
            <div>
              <h4 className="font-semibold mb-3 text-white">Docs</h4>
              <ul className="space-y-2">
                {footerLinks.docs.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h4 className="font-semibold mb-3 text-white">Community</h4>
              <ul className="space-y-2">
                {footerLinks.community.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="text-gray-300 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold mb-3 text-white">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Newsletter and Social */}
          <div className="lg:col-span-1">
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-white">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter email"
                  className="bg-[#1A2B36] border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
                />
                <Button 
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Social Icons */}
            <div>
              <h4 className="font-semibold mb-3 text-white">Connect</h4>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/PhucLam202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#1A2B36] hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4 text-gray-300 group-hover:text-white" />
                </a>
                <a
                  href="https://twitter.com/liquidsync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#1A2B36] hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-gray-300 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#1A2B36] hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Discord"
                >
                  <MessageCircle className="w-4 h-4 text-gray-300 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Row */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 LiquidSync. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/terms"
                className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}