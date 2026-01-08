'use client';

import MobileMenu from './mobile-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogoSvg } from './logo-svg';
import CartModal from '@/components/cart/modal';
import { NavItem } from '@/lib/types';

export const navItems: NavItem[] = [
  {
    label: 'home',
    href: '/',
  },
  {
    label: 'shop all',
    href: '/shop-all',
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="grid fixed top-0 left-0 z-50 grid-cols-3 items-center w-full p-sides md:grid-cols-12 md:gap-sides bg-background/95 backdrop-blur-sm border-b border-border/50 py-3">
      <div className="block flex-none md:hidden">
        <MobileMenu />
      </div>
      <Link href="/" className="md:col-span-3 xl:col-span-2" prefetch>
        <LogoSvg className="w-auto h-6 max-md:place-self-center md:w-full md:h-auto max-w-96" />
      </Link>
      <nav className="flex gap-2 justify-end items-center md:col-span-9 xl:col-span-10">
        <ul className="items-center gap-5 py-1 px-4 bg-muted/60 rounded-full backdrop-blur-md hidden md:flex">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'font-semibold text-sm transition-colors duration-200 uppercase',
                  pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
                prefetch
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <CartModal />
      </nav>
    </header>
  );
}
