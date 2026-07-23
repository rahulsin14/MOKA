import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, parseImages } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
          Products
        </h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[var(--muted)]">
            <tr>
              <th className="py-3 font-medium">Product</th>
              <th className="py-3 font-medium">Category</th>
              <th className="py-3 font-medium">Price</th>
              <th className="py-3 font-medium">Stock</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const image = parseImages(product.images)[0];
              return (
                <tr key={product.id} className="border-b border-[var(--line)]">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-12 overflow-hidden bg-[var(--surface)]">
                        {image && (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {product.collection}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{product.category}</td>
                  <td className="py-3">{formatINR(product.price)}</td>
                  <td className="py-3">
                    {product.inStock ? "In stock" : "Sold out"}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-[var(--gold-deep)] underline-offset-2 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
