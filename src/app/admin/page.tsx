import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, paidOrders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
        Dashboard
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Products" value={String(productCount)} />
        <Stat label="Orders" value={String(orderCount)} />
        <Stat label="Revenue" value={formatINR(revenue)} />
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/admin/products/new" className="btn-primary">
          Add product
        </Link>
        <Link href="/admin/orders" className="btn-secondary">
          View orders
        </Link>
      </div>

      <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl">
        Recent orders
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[var(--muted)]">
            <tr>
              <th className="py-3 font-medium">Order</th>
              <th className="py-3 font-medium">Customer</th>
              <th className="py-3 font-medium">Amount</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--line)]">
                <td className="py-3">{order.orderNumber}</td>
                <td className="py-3">{order.customerName}</td>
                <td className="py-3">{formatINR(order.amount)}</td>
                <td className="py-3">{order.status}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-[var(--muted)]">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--surface)] px-5 py-6">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
        {value}
      </p>
    </div>
  );
}
