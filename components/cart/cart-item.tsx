'use client';

import type { CartItem } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import { formatCurrency } from '@/utils/helpers';

interface CartItemCardProps {
  item: CartItem;
  onCloseCart?: () => void;
}

export function CartItemCard({ item, onCloseCart }: CartItemCardProps) {
  const productUrl = `/product/${item.productId}`;
  const productImage = item.product.images?.[0] || item.product.thumbnail || '/placeholder.svg';
  const totalPrice = item.product.price * item.quantity;

  return (
    <div className="bg-muted rounded-xl p-3 border border-border">
      <div className="flex flex-row gap-4">
        <div className="relative size-20 overflow-hidden rounded-lg shrink-0 bg-background">
          <Image
            className="size-full object-contain p-1"
            width={160}
            height={160}
            alt={item.product.name}
            src={productImage}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <Link
            href={productUrl}
            onClick={onCloseCart}
            className="z-30"
            prefetch
          >
            <span className="text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
              {item.product.name}
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(item.product.price)} each
          </p>
          <p className="text-base font-bold text-primary">
            {formatCurrency(totalPrice)}
          </p>
          <div className="flex justify-between items-center mt-auto pt-1">
            <div className="flex h-7 flex-row items-center rounded-full border border-border bg-background">
              <EditItemQuantityButton item={item} type="minus" />
              <span className="w-6 text-center text-xs font-medium text-foreground">{item.quantity}</span>
              <EditItemQuantityButton item={item} type="plus" />
            </div>
            <DeleteItemButton item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;
