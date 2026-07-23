import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, newest] = await Promise.all([
    prisma.product.findFirst({
      where: { featured: true, inStock: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const collections = ["KAHAANI", "ERA", "9 to Shine", "Best Sellers"];

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
          alt="Woman wearing elegant jewellery"
          fill
          priority
          className="hero-image object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-16 text-center text-white sm:pb-24">
          <p className="animate-fade-up font-[family-name:var(--font-display)] text-5xl tracking-[0.22em] sm:text-7xl">
            MOKA
          </p>
          <h1 className="animate-fade-up-delay mt-4 max-w-xl font-[family-name:var(--font-display)] text-2xl font-medium leading-snug sm:text-3xl">
            Jewellery You&apos;ll Never Want to Take Off
          </h1>
          <p className="animate-fade-up-delay mt-3 text-sm tracking-wide text-white/85">
            Minimal. Elegant. Made for every day.
          </p>
          <Link
            href="/collections"
            className="animate-fade-up-delay mt-8 inline-flex border border-white/80 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition hover:bg-white hover:text-[var(--ink)]"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl gap-8 overflow-x-auto px-4 py-8 sm:justify-center sm:px-6">
          {collections.map((name) => (
            <Link
              key={name}
              href={`/collections?collection=${encodeURIComponent(name)}`}
              className="shrink-0 text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Featured product
          </p>
          <div className="mt-8 grid items-center gap-10 md:grid-cols-2">
            <Link
              href={`/products/${featured.slug}`}
              className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]"
            >
              <Image
                src={JSON.parse(featured.images)[0]}
                alt={featured.name}
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Link>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-5xl tracking-wide">
                {featured.name}
              </h2>
              <p className="mt-4 max-w-md text-[var(--muted)] leading-relaxed">
                {featured.description}
              </p>
              <Link href={`/products/${featured.slug}`} className="btn-primary mt-8">
                View product
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--surface)] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
              New this season
            </h2>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {newest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80"
          alt="Trending jewellery"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            Trending Jewellery That Turns Heads
          </h2>
          <Link
            href="/collections"
            className="mt-8 inline-flex border border-white/80 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition hover:bg-white hover:text-[var(--ink)]"
          >
            Shop now
          </Link>
        </div>
      </section>
    </>
  );
}
