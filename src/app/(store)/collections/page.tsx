import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ collection?: string; category?: string }>;
};

export default async function CollectionsPage({ searchParams }: Props) {
  const { collection, category } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      ...(collection ? { collection } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const title = collection || category || "Collections";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Jewellery designed for everyday elegance.
      </p>

      {products.length === 0 ? (
        <p className="mt-16 text-[var(--muted)]">No products found.</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
