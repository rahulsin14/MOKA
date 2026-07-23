"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("name")),
      customerEmail: String(form.get("email")),
      customerPhone: String(form.get("phone")),
      shippingAddress: String(form.get("address")),
      shippingCity: String(form.get("city")),
      shippingState: String(form.get("state")),
      shippingPincode: String(form.get("pincode")),
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create order");

      if (data.demoMode) {
        clearCart();
        router.push(`/order-success?order=${data.orderNumber}&demo=1`);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "MOKA india",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: payload.customerName,
          email: payload.customerEmail,
          contact: payload.customerPhone,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error || "Payment verification failed");
            setLoading(false);
            return;
          }
          clearCart();
          router.push(`/order-success?order=${data.orderNumber}`);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#8B7355" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-[var(--muted)]">
        Your cart is empty.{" "}
        <a href="/collections" className="underline">
          Browse collections
        </a>
      </p>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Shipping details
          </h2>
          <input name="name" required placeholder="Full name" className="input" />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          <input
            name="phone"
            required
            placeholder="Phone"
            className="input"
            pattern="[0-9]{10}"
            title="10-digit phone number"
          />
          <textarea
            name="address"
            required
            placeholder="Address"
            rows={3}
            className="input"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="city" required placeholder="City" className="input" />
            <input name="state" required placeholder="State" className="input" />
            <input
              name="pincode"
              required
              placeholder="PIN code"
              className="input"
              pattern="[0-9]{6}"
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Processing…" : `Pay ${formatINR(subtotal)}`}
          </button>
        </form>

        <aside className="h-fit bg-[var(--surface)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Order summary
          </h2>
          <ul className="mt-5 space-y-3 border-b border-[var(--line)] pb-5">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>
        </aside>
      </div>
    </>
  );
}
