// Session ID helpers for cart management
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('ecommerce-session-id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ecommerce-session-id', sessionId);
  }
  return sessionId;
};

export const clearSessionId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ecommerce-session-id');
  }
};

// Format a date to a readable string
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Format number as currency (Nigerian Naira)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Calculate cart totals
export function calculateCartTotals(
  subtotal: number,
  taxRate = 0.1,
  freeShippingThreshold = 100,
  shippingCost = 9.99
) {
  const tax = Number((subtotal * taxRate).toFixed(2));
  const shipping = subtotal > freeShippingThreshold ? 0 : shippingCost;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  return { subtotal, tax, shipping, total };
}

// Debounce function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
