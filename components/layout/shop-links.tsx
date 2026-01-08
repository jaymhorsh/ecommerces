'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCategoriesQuery } from '@/hooks/use-products-query';

interface ShopLinksProps {
  align?: 'left' | 'right';
  label?: string;
  className?: string;
}

export function ShopLinks({ label = 'Shop', align = 'left', className }: ShopLinksProps) {
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <div className={cn(align === 'right' ? 'text-right' : 'text-left', className)}>
      <h4 className="text-lg font-extrabold md:text-xl">{label}</h4>

      <ul className="flex flex-col gap-1.5 leading-5 mt-5">
        <li>
          <Link href="/shop" prefetch>
            All Products
          </Link>
        </li>
        {categories.map((category, index) => (
          <li key={`${category}-${index}`}>
            <Link href={`/shop?category=${encodeURIComponent(category)}`} prefetch>
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
