'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/types';

/**
 * Simple product image hook for our API
 * Since we don't have variants like Shopify, this just returns the product image
 */
export const useProductImages = (product: Product) => {
  const images = useMemo(() => {
    // First try thumbnail, then first image from images array
    const imageUrl = product.thumbnail || product.images?.[0] || '/placeholder.svg';
    return [{ url: imageUrl, altText: product.name }];
  }, [product.thumbnail, product.images, product.name]);

  return images;
};

/**
 * Placeholder for variant selection - our products don't have variants
 * This is kept for compatibility with existing code that may reference it
 */
export const useSelectedOptions = (_product: Product): Record<string, string> => {
  return {};
};

export const useSelectedVariant = (_product: Product) => {
  return undefined;
};
