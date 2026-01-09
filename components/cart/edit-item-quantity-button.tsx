'use client';

import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import type { CartItem } from '@/lib/types';
import { useCart } from '@/components/cart/cart-context';
import { useTransition } from 'react';

function SubmitButton({
  type,
  disabled,
}: {
  type: 'plus' | 'minus';
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 disabled:opacity-50',
        {
          'ml-auto': type === 'minus',
        }
      )}
    >
      {type === 'plus' ? (
        <Plus className="h-4 w-4" />
      ) : (
        <Minus className="h-4 w-4" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: 'plus' | 'minus';
}) {
  const { updateCartItem, removeFromCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const nextQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          if (nextQuantity <= 0) {
            await removeFromCart(item.id);
          } else {
            await updateCartItem(item.id, nextQuantity);
          }
        });
      }}
    >
      <SubmitButton type={type} disabled={isPending} />
    </form>
  );
}

export default EditItemQuantityButton;
