"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR, parseImages } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const images = parseImages(product.images);
  const image = images[0] || "/placeholder-product.svg";

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)]">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {formatINR(product.price)}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--ink)] underline-offset-4 transition hover:text-[var(--gold)] hover:underline"
        onClick={() =>
          addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image,
          })
        }
      >
        Add
      </button>
    </article>
  );
}
