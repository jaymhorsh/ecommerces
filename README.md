# 4040Store - E-Commerce Frontend

A modern, responsive e-commerce storefront built with Next.js 15 and React 19. This is the frontend application for the 4040Store marketplace platform.

## Features

- 🛍️ **Product Catalog** - Browse products with category filtering, search, and price range filters
- 🛒 **Shopping Cart** - Add, update, and remove items with real-time cart updates
- 📦 **Order Management** - Place orders and view order history
- 🔍 **Search & Filter** - Debounced search with category and price filtering
- 📱 **Responsive Design** - Mobile-first UI with sidebar filters on desktop, sheet filters on mobile
- ⚡ **Optimized Performance** - Built with Next.js Turbopack and React 19
- 🎨 **Modern UI** - Beautiful animations with Framer Motion and shadcn/ui components

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| State Management | Zustand + React Context |
| HTTP Client | Axios with interceptors |
| Animations | Framer Motion |
| Type Safety | TypeScript |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home/Landing page
│   ├── shop-all/           # Product catalog with filters
│   ├── product/[id]/       # Product detail page
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   └── orders/             # Order history & details
├── components/
│   ├── cart/               # Cart components (context, items, buttons)
│   ├── layout/             # Header, footer, navigation
│   ├── products/           # Product cards, grids
│   ├── ui/                 # shadcn/ui components
│   └── carousel/           # Auto-scroll product carousel
├── services/               # API service layer
│   ├── products.ts         # Product API calls
│   ├── cart.ts             # Cart API calls
│   └── orders.ts           # Order API calls
├── store/                  # Zustand state stores
│   ├── products-store.ts   # Products state & actions
│   ├── cart-store.ts       # Cart state & actions
│   └── auth-store.ts       # Auth state
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & axios config
└── types/                  # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone git@github.com:jaymhorsh/ecommerces.git
cd ecommerces

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

### Development

```bash
# Start dev server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Integration

The app connects to a REST API backend. All API calls are centralized in the `/services` directory.

### Products API

```typescript
// Fetch paginated products
GET /products?limit=12&page=1

// Fetch by category
GET /products?category=electronics&limit=12&page=1

// Search products
GET /products?search=laptop&limit=12
```

### Cart API

```typescript
// Get cart
GET /cart/:sessionId

// Add item to cart
POST /cart/:sessionId
{ productId: number, quantity: number }

// Update item quantity
PUT /cart/:sessionId/items/:itemId
{ quantity: number }

// Remove item
DELETE /cart/:sessionId/items/:itemId
```

### Orders API

```typescript
// Create order from cart
POST /orders
{ sessionId: string }

// Get order details
GET /orders/:id
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Key Features Implementation

### Product Filtering
- Category-based filtering via URL query params
- Price range slider with min/max inputs
- Debounced search (500ms delay)
- Pagination with page number display

### Cart Management
- Session-based cart persistence
- Optimistic UI updates
- Real-time quantity editing
- Cart total calculation

### Responsive Layout
- Desktop: Sticky sidebar filters
- Mobile: Sheet-based filter panel
- Adaptive grid (2-4 columns based on screen size)

## License

MIT

---

**4040Store** - Modern E-Commerce Experience
