import { CheckoutForm } from "@/components/store/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-10 font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
