import Link from "next/link";

type Props = {
  searchParams: Promise<{ order?: string; demo?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { order, demo } = await searchParams;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
        Thank you
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Order confirmed
      </h1>
      {order && (
        <p className="mt-4 text-[var(--muted)]">
          Your order number is{" "}
          <span className="font-medium text-[var(--ink)]">{order}</span>
        </p>
      )}
      {demo === "1" && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Demo mode: Razorpay keys are placeholders, so payment was skipped.
          Add your real keys in <code>.env</code> to enable live checkout.
        </p>
      )}
      <Link href="/collections" className="btn-primary mt-10">
        Continue shopping
      </Link>
    </div>
  );
}
