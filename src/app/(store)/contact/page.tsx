export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-wide">
        Contact
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Questions about an order or a piece you love? We&apos;re here.
      </p>
      <div className="mt-10 space-y-4 text-sm">
        <p>
          <span className="text-[var(--muted)]">Email</span>
          <br />
          hello@mokaindia.com
        </p>
        <p>
          <span className="text-[var(--muted)]">Instagram</span>
          <br />
          @mokaindia
        </p>
      </div>
    </div>
  );
}
