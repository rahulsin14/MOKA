"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { ProductImage } from "@/components/store/ProductImage";
import { formatINR } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={() => setIsOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--bg)] shadow-xl animate-[slideIn_0.35s_ease]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide">
            Cart ({itemCount})
          </h2>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-[var(--muted)]">Your cart is empty</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[var(--surface)]">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-[family-name:var(--font-display)] text-lg leading-tight"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatINR(item.price)}
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        className="rounded border border-[var(--line)] p-1"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="rounded border border-[var(--line)] p-1"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--line)] px-5 py-5">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="font-medium">{formatINR(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
