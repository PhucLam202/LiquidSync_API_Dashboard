# LiquidSync

A modern financial dashboard built with Next.js, React, TailwindCSS, and shadcn/ui featuring a beautiful Peach Fuzz color scheme.

## 🛠️ Tech Stack

- **Next.js 15** - React framework with Turbopack
- **React 19** - UI library  
- **TypeScript** - Type safety
- **TailwindCSS v4** - Styling framework
- **shadcn/ui** - UI component library
- **ESLint** - Code linting
- **Lucide React** - Icon library

## 🚀 Getting Started

### Installation & Development

1. **Install dependencies**
```bash
pnpm install
```

2. **Run development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

3. **Build for production**
```bash
pnpm build
```

4. **Run production server**
```bash
pnpm start
```

5. **Lint code**
```bash
pnpm lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles with shadcn/ui themes
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components  
│   ├── dashboard/        # Dashboard components
│   └── forms/            # Form components
├── lib/
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## 🎨 Components Available

### shadcn/ui Components
- Button (multiple variants)
- Card (with header, content)
- Input
- And more can be added with: `npx shadcn@latest add [component]`

### Custom Components
- **Header** - Navigation with wallet connect
- **DashboardCards** - Statistics display cards
- **QuickActions** - Action buttons grid

## 📦 Adding New Components

Add shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

Available components: button, card, input, dialog, toast, dropdown-menu, and [many more](https://ui.shadcn.com/docs/components).

## 🎯 Features

- ✅ Modern React 19 with Next.js 15
- ✅ Full TypeScript support
- ✅ TailwindCSS v4 with modern features  
- ✅ shadcn/ui component library integration
- ✅ Dark/light theme support (CSS variables)
- ✅ Responsive design
- ✅ Turbopack for fast development
- ✅ ESLint configuration
- ✅ Component library organization

## 📝 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [shadcn/ui Documentation](https://ui.shadcn.com) - component library documentation.
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework.

## 🚧 Next Steps

1. Add more shadcn/ui components as needed
2. Set up state management (Zustand/Redux)
3. Add API integration
4. Implement wallet connection
5. Add testing framework
6. Set up CI/CD

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
