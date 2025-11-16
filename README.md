# 🚀 SaaS Pricing Calculator

A **stunning, modern** Next.js application for visualizing and calculating pricing estimates for Phone Call SaaS infrastructure. Built with cutting-edge design principles and beautiful animations.

## ✨ Features

- **💎 Modern Card Layout**: Beautiful card-based design (not tables!) with gradient backgrounds and smooth hover effects
- **🎨 Vibrant Gradients**: Eye-catching purple, pink, blue, and cyan gradients throughout
- **✨ Smooth Animations**: Floating backgrounds, fade-in effects, scale animations, and micro-interactions
- **📊 Real-time Summary**: Sticky summary cards showing total costs across all user tiers
- **🔍 Detailed Modals**: Click any card to view comprehensive breakdown with glass morphism effects
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🎭 Category Icons**: Visual indicators for different service types
- **🌟 Premium Effects**: Glassmorphism, glow effects, custom scrollbars, and more

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Data Structure

The pricing data is stored in `data/pricing-data.ts` and includes:

- Service/Application name
- Costs for 100, 1,000, and 10,000 users
- Notes and additional context
- Detailed breakdowns (why, how, where, cost breakdown)

## 🎨 Design Features

### Modern SaaS Aesthetic
- **Card-based layout** instead of traditional tables
- **Gradient backgrounds** with category-specific colors
- **Glassmorphism effects** for depth and modern feel
- **Animated floating orbs** in the background
- **Smooth hover animations** with elevation effects

### Visual Hierarchy
- **Sticky summary cards** at the top showing total costs
- **Color-coded categories** for easy identification
- **Proper spacing** with consistent padding (p-4, p-6, p-8)
- **Typography scale** from text-xs to text-7xl
- **Icon system** for visual categorization

### Interactive Details
Click any service card to view:
- **Why**: The purpose of this expense
- **How**: How the cost is calculated  
- **Where**: Where the money goes
- **Cost Breakdown**: Detailed calculation in monospace font
- **Notes**: Additional important information

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Heroicons** - Icons

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css      # Global styles
├── components/
│   └── PricingTable.tsx # Main pricing table component
└── data/
    └── pricing-data.ts  # Pricing data and types
```

## Customization

To add or modify pricing data, edit `data/pricing-data.ts`. Each entry follows the `PricingRow` interface:

```typescript
interface PricingRow {
  id: string;
  app: string;
  cost100: number | null;
  cost1000: number | null;
  cost10000: number | null;
  notes: string;
  details?: {
    why: string;
    how: string;
    where: string;
    breakdown?: string;
  };
}
```

## License

MIT
