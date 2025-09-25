'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Check, 
  Code, 
  Terminal, 
  FileText,
  ExternalLink,
  Play,
  Zap
} from 'lucide-react';
import { APIFilters } from '../types/api.types';
import { defiAPI } from '../services/defi-api.service';

interface APIExamplesProps {
  currentFilters?: APIFilters | null;
  loading?: boolean;
}

type CodeFormat = 'curl' | 'javascript' | 'python' | 'json';

interface CodeExample {
  title: string;
  language: string;
  icon: React.ReactNode;
  description: string;
  code: string;
}

const APIExamples: React.FC<APIExamplesProps> = ({
  currentFilters,
  loading = false
}) => {
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [activeFormat, setActiveFormat] = useState<CodeFormat>('curl');

  // Copy to clipboard function
  const copyToClipboard = useCallback(async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(identifier);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  // Generate code examples based on current filters
  const generateExamples = useCallback((): Record<CodeFormat, CodeExample> => {
    const baseUrl = 'https://api.liquidsnc.com'; // Production API URL
    const endpoint = '/api/v1/defi/tvl/overview';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (currentFilters?.category && currentFilters.category !== 'all') {
      params.append('category', currentFilters.category);
    }
    if (currentFilters?.growth && currentFilters.growth !== 'all') {
      params.append('growth', currentFilters.growth);
    }
    if (currentFilters?.timeframe && currentFilters.timeframe !== '7d') {
      params.append('timeframe', currentFilters.timeframe);
    }
    if (currentFilters?.limit && currentFilters.limit !== 50) {
      params.append('limit', currentFilters.limit.toString());
    }
    
    const queryString = params.toString();
    const fullUrl = `${baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
    
    return {
      curl: {
        title: 'cURL',
        language: 'bash',
        icon: <Terminal className="w-4 h-4" />,
        description: 'Command line HTTP client',
        code: `curl -X GET "${fullUrl}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "User-Agent: MyApp/1.0"

# Response will include:
# - Total TVL across all protocols
# - Top protocols with market share
# - Category breakdowns
# - Growth metrics and trends
# - Market intelligence insights`
      },
      
      javascript: {
        title: 'JavaScript/Node.js',
        language: 'javascript',
        icon: <Code className="w-4 h-4" />,
        description: 'Fetch API and Axios examples',
        code: `// Using Fetch API
const response = await fetch('${fullUrl}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
    'User-Agent': 'MyApp/1.0'
  }
});

const data = await response.json();
console.log('Total TVL:', data.data.totalTvl);
console.log('Top Protocol:', data.data.topProtocols[0]);

// Using Axios
import axios from 'axios';

const { data } = await axios.get('${fullUrl}', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Process the data
const tvlByCategory = data.data.topProtocols.reduce((acc, protocol) => {
  acc[protocol.category] = (acc[protocol.category] || 0) + protocol.tvl;
  return acc;
}, {});`
      },
      
      python: {
        title: 'Python',
        language: 'python',
        icon: <FileText className="w-4 h-4" />,
        description: 'Requests library example',
        code: `import requests
import json

# API configuration
url = "${fullUrl}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
    "User-Agent": "MyApp/1.0"
}

# Make the request
response = requests.get(url, headers=headers)

# Check if request was successful
if response.status_code == 200:
    data = response.json()
    
    # Extract key metrics
    total_tvl = data['data']['totalTvl']
    total_protocols = data['data']['totalProtocols']
    top_protocols = data['data']['topProtocols']
    
    print(f"Total TVL: $\{total_tvl:,.2f\}")
    print(f"Total Protocols: \{total_protocols:,\}")
    
    # Print top 5 protocols
    for i, protocol in enumerate(top_protocols[:5]):
        print(f"\{i+1\}. \{protocol['name']\}: $\{protocol['tvl']:,.2f\}")
        
else:
    print(f"Error: \{response.status_code\} - \{response.text\}")`
      },
      
      json: {
        title: 'Response Schema',
        language: 'json',
        icon: <FileText className="w-4 h-4" />,
        description: 'Expected API response structure',
        code: `{
  "success": true,
  "data": {
    "totalTvl": 821700000000,
    "totalProtocols": 6419,
    "dominantChain": "Ethereum",
    "chainDominance": 64.2,
    "growth_7d": 2.8,
    "growth_1d": 1.2,
    "topProtocols": [
      {
        "name": "MakerDAO",
        "tvl": 15420000000,
        "category": "Lending",
        "chain": "Ethereum",
        "growth7d": 3.2,
        "growth_1d": 1.1,
        "marketShare": 1.88
      }
      // ... more protocols
    ]
  },
  "intelligence": {
    "marketSentiment": "Bullish",
    "volatilityIndex": 0.45,
    "riskScore": 4.2,
    "trendAnalysis": "Market showing strong fundamentals"
  },
  "metadata": {
    "timestamp": "2025-01-14T10:30:00Z",
    "responseTime": 145,
    "dataFreshness": 45
  }
}`
      }
    };
  }, [currentFilters]);

  const examples = generateExamples();
  const currentExample = examples[activeFormat];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-[#FF8A66]" />
          Try Our API
        </h3>
        <p className="text-sm text-muted-foreground">
          Copy-paste examples for instant integration
        </p>
        {currentFilters && Object.keys(currentFilters).length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              Dynamic filters applied
            </Badge>
          </div>
        )}
      </div>

      {/* API Examples */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code Examples
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {loading ? 'Updating...' : 'Live'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => window.open('https://docs.liquidsnc.com/api', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Docs
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as CodeFormat)}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {Object.entries(examples).map(([key, example]) => (
                <TabsTrigger key={key} value={key} className="text-xs flex items-center gap-1">
                  {example.icon}
                  <span className="hidden sm:inline">{example.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(examples).map(([key, example]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="space-y-4">
                  {/* Example Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {example.icon}
                        {example.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {example.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(example.code, key)}
                        className="h-8 px-3"
                      >
                        {copiedCode === key ? (
                          <>
                            <Check className="w-3 h-3 mr-1 text-emerald-500" />
                            <span className="text-xs">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            <span className="text-xs">Copy</span>
                          </>
                        )}
                      </Button>
                      
                      {key === 'curl' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 px-3 bg-[#FF8A66] hover:bg-[#FF8A66]/90"
                          onClick={() => {
                            // In a real app, this might open a playground or make a test request
                            console.log('Test API call triggered');
                          }}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          <span className="text-xs">Test</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Code Block */}
                  <div className="relative">
                    <pre className="bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border">
                      <code className={`language-${example.language}`}>
                        {example.code}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-[#FF8A66]/5 to-orange-50 border-[#FF8A66]/20">
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF8A66]" />
              <h4 className="font-medium text-gray-900">Quick Start</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF8A66] text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Get API Key</p>
                  <p className="text-gray-600 text-xs">
                    Sign up for free access to our DeFi data API
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF8A66] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Copy Code</p>
                  <p className="text-gray-600 text-xs">
                    Use examples above in your favorite language
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF8A66] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Building</p>
                  <p className="text-gray-600 text-xs">
                    Access live DeFi data in your applications
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                99.9% Uptime
              </Badge>
              <Badge variant="outline" className="text-xs">
                Real-time Data
              </Badge>
              <Badge variant="outline" className="text-xs">
                6,000+ Protocols
              </Badge>
              <Badge variant="outline" className="text-xs">
                Multi-chain Support
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIExamples;