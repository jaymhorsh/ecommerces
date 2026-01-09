'use client';

import { ArrowRight, PlusCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Loader } from '../ui/loader';
import { CartItemCard } from './cart-item';
import { formatCurrency } from '@/utils/helpers';
import { useBodyScrollLock } from '@/lib/hooks/use-body-scroll-lock';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Cart } from '@/lib/types';

const CartContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('px-3 md:px-4', className)}>{children}</div>;
};

const CartItems = ({ closeCart }: { closeCart: () => void }) => {
  const { cart, getTotals } = useCart();
  const totals = getTotals();

  if (!cart) return null;

  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <CartContainer className="flex justify-between text-sm text-muted-foreground">
        <span>Products</span>
        <span>{cart.items.length} items</span>
      </CartContainer>
      <div className="relative flex-1 min-h-0 py-4 overflow-x-hidden">
        <CartContainer className="overflow-y-auto flex flex-col gap-y-3 h-full scrollbar-hide">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <CartItemCard item={item} onCloseCart={closeCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </CartContainer>
      </div>
      <CartContainer>
        <div className="py-4 text-sm shrink-0">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-border">
            <p className="text-muted-foreground">Subtotal</p>
            <p className="text-foreground font-medium">{formatCurrency(totals.subtotal)}</p>
          </div>
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-border">
            <p className="text-muted-foreground">Tax (10%)</p>
            <p className="text-foreground font-medium">{formatCurrency(totals.tax)}</p>
          </div>
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-border">
            <p className="text-muted-foreground">Shipping</p>
            <p className="text-foreground font-medium">
              {totals.shipping === 0
                ? 'Free'
                : formatCurrency(totals.shipping)}
            </p>
          </div>
          <div className="flex justify-between items-center pt-2 text-lg font-bold">
            <p className="text-foreground">Total</p>
            <p className="text-primary">
              {formatCurrency(totals.total)}
            </p>
          </div>
        </div>
        <CheckoutButton onCheckout={closeCart} />
      </CartContainer>
    </div>
  );
};

const serializeCart = (cart: Cart) => {
  return JSON.stringify(
    cart.items.map((item) => ({
      itemId: item.id,
      quantity: item.quantity,
    }))
  );
};

export default function CartModal() {
  const { cart, loading: isLoading, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const serializedCart = useRef(cart ? serializeCart(cart) : undefined);
  const itemCount = getItemCount();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!cart || isLoading) return;

    const newSerializedCart = serializeCart(cart);

    // Initialize on first load
    if (serializedCart.current === undefined) {
      serializedCart.current = newSerializedCart;
      return;
    }

    // Only open cart if items were actually added (not removed or cleared)
    // Don't open if cart is now empty (order was placed)
    if (serializedCart.current !== newSerializedCart && cart.items.length > 0) {
      // Check if items increased (something was added)
      const prevItems = JSON.parse(serializedCart.current || '[]');
      const hasMoreItems = cart.items.length >= prevItems.length;
      
      if (hasMoreItems) {
        setIsOpen(true);
      }
    }
    
    serializedCart.current = newSerializedCart;
  }, [cart, isLoading]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const renderCartContent = () => {
    if (!cart || cart.items.length === 0) {
      return (
        <CartContainer className="flex w-full">
          <Link
            href="/shop-all"
            className="p-3 w-full rounded-xl border border-dashed bg-muted border-border hover:border-primary transition-colors"
            onClick={closeCart}
          >
            <div className="flex flex-row gap-4">
              <div className="flex overflow-hidden relative justify-center items-center rounded-lg border border-dashed size-16 shrink-0 border-border bg-background">
                <PlusCircleIcon className="size-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col flex-1 gap-1 justify-center">
                <span className="text-base font-semibold text-foreground">
                  Cart is empty
                </span>
                <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Start shopping to get started
                </p>
              </div>
            </div>
          </Link>
        </CartContainer>
      );
    }

    return <CartItems closeCart={closeCart} />;
  };

  return (
    <>
      <Button
        aria-label="Open cart"
        onClick={openCart}
        className="uppercase"
        size={'sm'}
      >
        <span className="max-md:hidden">cart</span> ({itemCount})
      </Button>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 z-50 bg-foreground/30"
              onClick={closeCart}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 bottom-0 right-0 flex w-full md:w-[420px] p-3 z-50 h-screen"
            >
              <div className="flex flex-col py-4 w-full h-full rounded-xl bg-background shadow-2xl border border-border overflow-hidden">
                <CartContainer className="flex justify-between items-baseline mb-6 pb-4 border-b border-border">
                  <p className="text-xl font-bold text-foreground">Cart</p>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label="Close cart"
                    onClick={closeCart}
                    className="text-foreground"
                  >
                    Close
                  </Button>
                </CartContainer>

                {renderCartContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function CheckoutButton({ onCheckout }: { onCheckout: () => void }) {
  const { cart, loading: isLoading } = useCart();
  const router = useRouter();

  const isDisabled = !cart?.items.length || isLoading;

  const handleCheckout = () => {
    onCheckout(); // Close the modal first
    router.push('/cart');
  };

  return (
    <Button
      type="button"
      disabled={isDisabled}
      size="lg"
      className="flex relative gap-3 justify-between items-center w-full"
      onClick={handleCheckout}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isLoading ? 'loading' : 'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex justify-center items-center w-full"
        >
          {isLoading ? (
            <Loader size="default" />
          ) : (
            <div className="flex justify-between items-center w-full">
              <span>Proceed to Checkout</span>
              <ArrowRight className="size-6" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
