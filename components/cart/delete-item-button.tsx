'use client';

import type { CartItem } from '@/lib/types';
import { Button } from '../ui/button';
import { useCart } from '@/components/cart/cart-context';
import { useTransition } from 'react';
import { Loader } from '../ui/loader';

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="-mr-1 -mb-1 opacity-70"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await removeFromCart(item.id);
        });
      }}
    >
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        aria-label="Remove item"
        className="px-2 text-sm"
        disabled={isPending}
      >
        {isPending ? <Loader size="sm" /> : 'Remove'}
      </Button>
    </form>
  );
}

export default DeleteItemButton;
