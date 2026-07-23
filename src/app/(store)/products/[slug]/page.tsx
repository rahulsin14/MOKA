import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { ProductImage } from "@/components/store/ProductImage";
import { formatINR, parseImages } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const images = parseImages(product.images);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div className="space-y-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]"
          >
            <ProductImage
              src={src}
              alt={`${product.name} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        {product.collection && (
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            {product.collection}
          </p>
        )}
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-lg">{formatINR(product.price)}</p>
        <p className="mt-6 leading-relaxed text-[var(--muted)]">
          {product.description}
        </p>
        <div className="mt-8">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: images[0] || "",
            }}
          />
        </div>
        <dl className="mt-10 space-y-2 text-sm text-[var(--muted)]">
          <div className="flex gap-2">
            <dt>Category</dt>
            <dd className="text-[var(--ink)]">{product.category}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Availability</dt>
            <dd className="text-[var(--ink)]">
              {product.inStock ? "In stock" : "Sold out"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
