# Get440 - Global Marketplace Platform

A modern, feature-rich e-commerce marketplace platform built with Next.js, designed to connect buyers with sellers worldwide.

## Features

- **Responsive Design**: Mobile-first approach with beautiful UI across all devices
- **Product Catalog**: Browse and search millions of products across multiple categories
- **Shopping Cart**: Easy-to-use cart management with real-time updates
- **Order Management**: Track orders and view order history
- **Auto-Scrolling Carousel**: Featured products with smooth auto-scroll and drag-to-navigate
- **Seller Integration**: Tools for merchants to list and manage products
- **Secure Payments**: Ready for payment gateway integration

## Tech Stack

- **Frontend**: Next.js 14+ with React 18+
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios with interceptors
- **UI Components**: shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Type Safety**: TypeScript

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Landing page
│   ├── products/                 # Products listing
│   ├── cart/                     # Shopping cart
│   ├── orders/                   # Order history
│   └── layout.tsx                # Root layout
├── components/
│   ├── carousel/                 # Auto-scroll carousel component
│   ├── layout/                   # Layout components (header, footer)
│   ├── cart/                     # Cart-related components
│   ├── products/                 # Product-related components
│   └── ui/                       # Reusable UI components
├── services/                     # API service layer
│   ├── api-client.ts             # Axios wrapper with interceptors
│   ├── products.ts               # Product API calls
│   ├── cart.ts                   # Cart API calls
│   └── orders.ts                 # Orders API calls
├── hooks/                        # Custom React hooks
│   ├── use-products.ts           # Products hook
│   └── use-cart.ts               # Cart hook
├── lib/                          # Utility functions & constants
│   ├── axios-instance.ts         # Axios configuration
│   └── utils.ts                  # Helper utilities
└── public/                       # Static assets
```

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The project is structured to easily integrate with a backend API. The services layer in `/services` provides all API endpoints ready for connection.

### Example: Getting Products

```typescript
import { useProducts } from "@/hooks/use-products"

export default function ProductsPage() {
  const { products, loading, error } = useProducts()
  
  return (
    // Your JSX here
  )
}
```

### Example: Managing Cart

```typescript
import { useCart } from "@/hooks/use-cart"

export default function Cart() {
  const { cart, addItem, removeItem, updateItem } = useCart()
  
  return (
    // Your JSX here
  )
}
```

## Axios Configuration

The axios client is configured with:
- **Automatic Token Injection**: Bearer tokens automatically added to requests
- **401 Handling**: Automatic logout and redirect to login on unauthorized access
- **Request/Response Interceptors**: Ready for custom middleware
- **Base URL Configuration**: Centralized API endpoint management

## Components

### AutoScrollCarousel
A responsive carousel component with auto-scroll, drag-to-navigate, and manual arrow controls.

**Props:**
- `items`: Array of React components to display
- `itemWidth`: Width of each item (default: 280px)
- `gap`: Gap between items (default: 16px)
- `autoScrollInterval`: Auto-scroll interval in ms (default: 3000ms)
- `pauseOnHover`: Pause auto-scroll on hover (default: true)
- `onItemClick`: Callback when item is clicked

## Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Future Enhancements

- Real payment gateway integration (Stripe, PayPal)
- User authentication system
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filtering
- Inventory management
- Order notifications
- Admin dashboard

## License

MIT

## Support

For issues or questions, please contact the Get440 team.

---

**Built with ❤️ for global commerce**
