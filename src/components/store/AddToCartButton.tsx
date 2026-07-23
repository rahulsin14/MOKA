"use client";

import { useCart } from "@/components/providers/CartProvider";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="btn-primary"
      onClick={() =>
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
        })
      }
    >
      Add to cart
    </button>
  );
}
