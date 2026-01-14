"use client"

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { navItems } from './index';
import { useBodyScrollLock } from '@/lib/hooks/use-body-scroll-lock';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <>
      <Button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        variant="secondary"
        size="sm"
        className="uppercase md:hidden"
      >
        Menu
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              // transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 z-50 bg-foreground/30"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Panel */}
            <div
              // initial={{ x: '-100%' }}
              // animate={{ x: 0 }}
              // exit={{ x: '-100%' }}
              // transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 bottom-0 left-0 flex w-full max-sm:w-[300px] z-50 h-screen"
            >
              <div className="flex flex-col py-4 px-4 w-full h-full rounded-r-md bg-background shadow-2xl border border-border overflow-hidden">
                <div className="flex justify-between items-baseline mb-6 pb-4 border-b border-border">
                  <p className="text-xl font-bold text-foreground">Menu</p>
                  <Button size="sm" variant="outline" aria-label="Close menu" onClick={closeMobileMenu}>
                    Close
                  </Button>
                </div>

                <nav className="flex flex-col gap-y-3 gap-x-4 mb-8">
                  {navItems.map(item => (
                    <Button
                      key={item.href}
                      size="sm"
                      variant="secondary"
                      onClick={closeMobileMenu}
                      className="justify-start uppercase"
                      asChild
                    >
                      <Link href={item.href} prefetch>
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </nav>

                <div className="mt-auto mb-6 text-sm leading-tight text-muted-foreground">
                  <p className="italic">Advanced Power Solutions. Efficient. Reliable.</p>
                  <div className="mt-5 space-y-1">
                    <p>Inverters that convert DC to AC power seamlessly.</p>
                    <p>Maximum efficiency with advanced electrical engineering.</p>
                    <p>Solar energy optimization - sustainable power first</p>
                  </div>
                </div>
              
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
