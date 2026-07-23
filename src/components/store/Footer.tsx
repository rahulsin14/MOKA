import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.18em]">
            MOKA
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            Minimal. Elegant. Jewellery you&apos;ll never want to take off.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/collections" className="hover:text-[var(--gold)]">
                Collections
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--gold)]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--gold)]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Connect
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            hello@mokaindia.com
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">India</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-4 py-5 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} MOKA india
      </div>
    </footer>
  );
}
