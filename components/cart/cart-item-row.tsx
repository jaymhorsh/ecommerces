"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/helpers";
import type { CartItemRowProps } from "@/types";
export function CartItemRow({ item, isLoading, onRemove, onUpdateQuantity }: CartItemRowProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onRemove(item.id);
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.quantity > 1) {
      await onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <Card className="overflow-hidden border border-border bg-card p-4">
      <div className="flex gap-4">
        <div className="h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-muted">
          <img
            src={
              item.product.thumbnail ||
              item.product.images?.[0] ||
              "/placeholder.svg"
            }
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Link href={`/product/${item.product.id}`}>
                <h3 className="font-semibold text-foreground text-lg line-clamp-1 hover:text-primary transition-colors">
                  {item.product.name}
                </h3>
              </Link>
              <p className="text-primary font-bold">
                {formatCurrency(item.product.price)}
              </p>
            </div>
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading || item.quantity <= 1}
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="ml-auto text-sm text-muted-foreground">
              Subtotal: {formatCurrency(item.product.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
