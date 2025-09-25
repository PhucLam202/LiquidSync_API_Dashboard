# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `pnpm` as the primary package manager.

```bash
# Install dependencies
pnpm install

# Development server with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build

# Production server
pnpm start

# Code linting
pnpm lint

# Type checking
npx tsc --noEmit
```

**Important**: Always use `pnpm` instead of `npm` or `yarn` for consistency.

## Architecture & Technology Stack

### Core Framework
- **Next.js 15** with App Router and Turbopack for fast development
- **React 19** with modern patterns and hooks  
- **TypeScript** for type safety throughout the application

### Authentication System
- **Dual authentication**: Email/password registration (3-step flow) + Web3 wallet login
- **JWT tokens**: Short-lived access tokens (15min) + httpOnly refresh tokens
- **AuthContext**: Centralized auth state management via React Context
- **Token Manager**: Automatic token refresh and secure storage
- **Protected routes**: Route-level authentication guards

### Web3 Integration
- **wagmi v2** for Ethereum interactions and wallet management
- **RainbowKit v2** for wallet connection UI with custom theming
- **viem** for low-level Ethereum interactions
- **Multi-chain support**: Mainnet, Polygon, Optimism, Arbitrum, Base, Sepolia
- **Dynamic imports** to prevent SSR issues with Web3 providers

### UI & Styling
- **TailwindCSS v4** with inline theme configuration
- **shadcn/ui** components built on Radix UI primitives
- **Peach Fuzz color scheme** with custom design tokens
- **Lucide React** for consistent iconography
- **next-themes** for dark/light theme switching with proper hydration handling

### State Management & Data Fetching
- **TanStack Query v5** for server state and data fetching
- **React Context** for global state (auth, theme)
- **localStorage** for client-side persistence (tokens, theme preferences)

## Project Structure

### Feature-Based Architecture
```
src/
├── app/                          # Next.js App Router
│   ├── (auth)                    # Authentication routes
│   │   ├── login/                # Login page
│   │   └── signup/               # 3-step registration flow
│   │       ├── email/            # Step 1: Email input
│   │       ├── otp/              # Step 2: OTP verification  
│   │       └── complete/         # Step 3: Profile completion
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── profile/              # User profile management
│   │   ├── analytics/            # Data visualization
│   │   └── [other-pages]/        # Additional dashboard features
│   └── layout.tsx                # Root layout with providers
├── features/                     # Feature-based organization
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth-specific hooks  
│   │   └── services/             # Auth business logic
│   ├── dashboard/                # Dashboard feature
│   └── profile/                  # Profile management feature
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── common/                   # Shared components
│   └── providers/                # Provider components
├── services/                     # External service integrations
│   ├── api/                      # API clients
│   ├── storage/                  # Storage management
│   └── web3/                     # Web3 service layer
├── contexts/                     # React contexts
├── hooks/                        # Shared custom hooks
├── types/                        # TypeScript type definitions
└── lib/                          # Utility functions
```

### Authentication System Architecture
```
Authentication Flows:
├── Email Registration (3-step)
│   ├── /signup/email → authAPI.firstRegister()
│   ├── /signup/otp → authAPI.verifyOtp()
│   └── /signup/complete → authAPI.completeProfile()
├── Email/Password Login
│   └── /login → authAPI.login()
├── Web3 Wallet Login
│   └── RainbowKit → wagmi → authAPI.loginWithWallet()
└── Hybrid Authentication (implemented)
    └── authAPI.linkEmailToWeb3()

Core Components:
├── AuthContext (src/contexts/auth-context.tsx)
├── TokenManager (src/services/storage/tokenStorage.ts)
├── AuthAPI Client (src/services/api/auth.service.ts)
├── ProtectedRoute (src/features/auth/components/ProtectedRoute.tsx)
└── Web3Providers (src/components/providers/Providers.tsx)
```

### Backend Integration
**API Configuration**: Centralized through `/src/lib/api-config.ts` with environment-based auto-detection

**Backend Endpoints**:
- Development: `http://localhost:3000` (auto-detected)
- Production: `https://liquidsyncapi-staging.up.railway.app` (auto-detected)  
- Staging: `https://liquidsyncapi-staging.up.railway.app` (fallback)
- Override: Set `NEXT_PUBLIC_API_BASE_URL` to use custom endpoint

**Authentication API** (`/src/services/api/auth.service.ts`):
- `POST /api/v1/auth/first-register` - Send OTP to email
- `POST /api/v1/auth/verify-otp` - Verify OTP code  
- `POST /api/v1/auth/complete-profile` - Complete registration
- `POST /api/v1/auth/login` - Email/password login
- `POST /api/v1/auth/web3-login` - Web3 wallet login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Invalidate tokens
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/link-email-to-web3` - Link accounts

**DeFi Data API** (`/src/components/common/sections/LiveDataPreview/services/defi-api.service.ts`):
- `GET /api/v1/defi/tvl/overview` - Get TVL overview with optional filters
- `GET /api/v1/health` - Health check endpoint
- Supports query parameters: `category`, `growth`, `timeframe`, `limit`, `chain`

### Provider Architecture
```
Application Root:
└── RootLayout
    ├── ThemeProvider (next-themes)
    ├── ErrorBoundary (global error handling)
    └── Web3Providers (client-side only)
        ├── AuthProvider (authentication state)
        ├── WagmiProvider (Web3 connection state)  
        ├── QueryClientProvider (server state)
        └── RainbowKitProvider (wallet connection UI)
```

**Environment Variables**:
```env
# Required for Web3 functionality
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional - API URL (auto-detected by environment if not set)
NEXT_PUBLIC_API_BASE_URL=https://liquidsyncapi-staging.up.railway.app

# Application customization (optional)
NEXT_PUBLIC_APP_NAME=LiquidSync DeFi
NEXT_PUBLIC_THEME_STORAGE_KEY=liquidsync-theme
```

## Key Architectural Patterns

### Feature-Based Organization
- **Co-location**: Related components, hooks, and services grouped by feature
- **Boundary isolation**: Clear separation between authentication, dashboard, and profile features  
- **Shared components**: Common UI components in `/src/components/common/`
- **Type safety**: Comprehensive TypeScript interfaces in `/src/types/`

### Authentication Context Pattern
- **Centralized state**: Single `AuthContext` managing all auth state
- **Automatic token refresh**: TokenManager handles token lifecycle transparently
- **Multi-flow support**: Email registration, login, Web3, and hybrid authentication
- **Error handling**: Custom `AuthAPIError` class with user-friendly messages
- **State persistence**: Tokens stored in localStorage, refresh tokens in httpOnly cookies

### Service Layer Architecture
```typescript
// API service with automatic retry and token management
const authAPI = new AuthAPIClient()
await authAPI.login({ email, password })

// Token manager with automatic refresh
const tokenManager = new TokenManager()
const validToken = await tokenManager.getValidAccessToken()

// Web3 service integration
import { config } from '@/services/web3/wagmi.service'
```

### Protected Route Pattern
```typescript
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

<ProtectedRoute>
  <DashboardContent />
</ProtectedRoute>
```

### Web3 Provider Pattern
- **Dynamic imports**: Prevents SSR hydration issues with Web3 providers
- **Progressive enhancement**: App works without Web3, enhanced when available
- **Custom theming**: RainbowKit themed to match Peach Fuzz design system
- **Multi-chain ready**: Configured for 6 major chains with extensibility

### Error Boundary Pattern
- **Global error handling**: Root-level ErrorBoundary catches all React errors
- **Unhandled promise rejection**: Global handlers for async errors
- **User-friendly fallbacks**: Graceful degradation with helpful error messages

## Development Guidelines

### Component Development
```typescript
// Use feature-based imports
import { LoginForm } from '@/features/auth/components'
import { DashboardCards } from '@/features/dashboard/components'

// Leverage custom hooks
const { user, isAuthenticated, login } = useAuth()
const { sendOTP, verifyOTP, isLoading } = useRegistrationFlow()
```

### Authentication Implementation
1. **State management**: Use `useAuth()` hook for all authentication state
2. **Registration flow**: Use `useRegistrationFlow()` for 3-step email signup
3. **Authenticated requests**: TokenManager automatically handles token attachment and refresh
4. **Error handling**: Catch and display user-friendly error messages from AuthAPIError

### Web3 Integration
1. **Wallet connection**: Use wagmi hooks (`useAccount`, `useConnect`, `useDisconnect`)
2. **Chain management**: Multi-chain support configured in `/src/services/web3/wagmi.service.ts`
3. **Authentication**: `AuthenticatedConnectButton` synchronizes wallet and auth state
4. **Error handling**: Graceful fallback when Web3 unavailable or user rejects

### Adding shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### Styling Guidelines
- **TailwindCSS v4**: Use inline theme configuration in `globals.css`
- **Design tokens**: Consistent color scheme using CSS custom properties
- **Responsive design**: Mobile-first approach with responsive utilities
- **Theme switching**: Dark/light mode support via next-themes

## Implementation Status

### ✅ Completed Features
- **Authentication system**: Full 3-step email registration, login, and Web3 wallet authentication
- **JWT token management**: Automatic refresh, secure storage, and error handling  
- **Protected routing**: Route-level authentication guards with redirect handling
- **Dashboard framework**: Responsive layout with sidebar navigation and theme switching
- **Profile management**: User profile display and account linking functionality
- **Web3 integration**: Multi-chain wallet connection with custom theming
- **Error handling**: Global error boundaries and user-friendly error messages
- **Type safety**: Comprehensive TypeScript coverage across all features
- **Live data preview**: DeFi TVL overview with interactive charts and filtering
- **Data visualization**: Multiple chart types using Recharts (area, bar, donut, scatter)
- **API client infrastructure**: Centralized API management with retry logic and error handling

### ⚠️ In Development  
- **Dashboard analytics**: Advanced data analysis and reporting features
- **Additional DeFi endpoints**: Protocol-specific data and historical trends
- **Testing coverage**: Unit tests and E2E testing framework setup

## Common Development Patterns

### Authentication Flow
```typescript
// Login with email/password
const { login, isLoading } = useAuth()
await login(email, password)

// Registration flow
const { sendOTP, verifyOTP, isLoading } = useRegistrationFlow()
await sendOTP(email)
await verifyOTP(email, otpCode)

// Web3 wallet authentication
const { loginWithWallet } = useAuth()
await loginWithWallet(walletAddress, signature, message)
```

### Protected Components
```typescript
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

### API Integration
```typescript
// Automatic token management
const response = await authAPI.makeAuthenticatedRequest('/api/endpoint')

// Custom API calls with error handling
try {
  const result = await authAPI.getProfile()
} catch (error) {
  if (error instanceof AuthAPIError) {
    // Handle specific auth errors
    console.log(error.getUserFriendlyMessage())
  }
}
```

### Web3 Integration
```typescript
import { useAccount, useConnect } from 'wagmi'

function WalletButton() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  
  // Wallet connection logic
}
```

### DeFi Data Integration
```typescript
// Using the DeFi API service
import { defiAPI } from '@/components/common/sections/LiveDataPreview/services/defi-api.service'

// Get TVL overview with filters
const tvlData = await defiAPI.getTVLOverview({
  category: 'lending',
  timeframe: '7d',
  limit: 20
})

// Generate API examples for documentation
const curlExample = defiAPI.generateAPIExample(filters, 'curl')
const axiosExample = defiAPI.generateAPIExample(filters, 'axios')
```

## Quality Assurance

### Code Quality
```bash
pnpm lint           # ESLint with Next.js rules
npx tsc --noEmit    # TypeScript type checking
```

### Security Practices
- **Token security**: Access tokens in memory, refresh tokens in httpOnly cookies
- **API security**: Bearer token authentication, CORS configuration
- **Input validation**: Zod schemas for form validation and API requests  
- **Error handling**: No sensitive data exposed in error messages
- **Web3 security**: No private key storage, secure signature verification

### Performance Optimization
- **Code splitting**: Dynamic imports for Web3 providers and large components
- **Bundle optimization**: TailwindCSS purging, Next.js optimization with Turbopack
- **State management**: Efficient React Query caching and TanStack Query patterns
- **Image optimization**: Next.js Image component with proper sizing
- **API caching**: Smart caching strategies for DeFi data with retry logic
- **Error boundaries**: Graceful error handling preventing full app crashes

## Additional Development Notes

### Data Visualization Components
The project includes a comprehensive data visualization system located in `/src/components/common/sections/LiveDataPreview/`:

**Chart Components**:
- `AreaChart.tsx` - TVL trends over time
- `CategoryDonutChart.tsx` - Protocol distribution by category
- `ProtocolBarChart.tsx` - Top protocols by TVL
- `GrowthScatterChart.tsx` - Protocol performance analysis
- `InteractiveChart/` - Advanced interactive charting components

**Hooks and Services**:
- `useTVLData.ts` - Custom hook for TVL data fetching and caching
- `defi-api.service.ts` - DeFi API client with retry logic and error handling
- `dataTransformers.ts` - Utilities for formatting API data for charts

### API Configuration Strategy
The application uses intelligent API endpoint detection through `/src/lib/api-config.ts`:
- **Auto-detection**: Automatically selects appropriate backend based on NODE_ENV
- **Override support**: Set `NEXT_PUBLIC_API_BASE_URL` to use custom endpoints
- **Debugging**: Includes logging helpers for configuration troubleshooting