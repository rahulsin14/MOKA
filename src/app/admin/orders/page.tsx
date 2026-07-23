import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
        Orders
      </h1>

      <div className="mt-8 space-y-4">
        {orders.length === 0 && (
          <p className="text-[var(--muted)]">No orders yet.</p>
        )}
        {orders.map((order) => (
          <article
            key={order.id}
            className="border border-[var(--line)] bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {order.customerName} · {order.customerEmail} ·{" "}
                  {order.customerPhone}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatINR(order.amount)}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                  {order.status}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} — {formatINR(item.price * item.quantity)}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {order.shippingAddress}, {order.shippingCity},{" "}
              {order.shippingState} {order.shippingPincode}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
