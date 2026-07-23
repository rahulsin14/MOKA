"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-[var(--line)] bg-[var(--surface)] md:w-56 md:border-b-0 md:border-r md:min-h-screen">
      <div className="px-5 py-6">
        <Link
          href="/admin"
          className="font-[family-name:var(--font-display)] text-xl tracking-[0.15em]"
        >
          MOKA Admin
        </Link>
      </div>
      <nav className="flex gap-1 px-3 pb-4 md:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded px-3 py-2 text-sm transition",
              pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href))
                ? "bg-[var(--ink)] text-white"
                : "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)]"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-2 px-3 py-4">
        <Link
          href="/"
          className="block rounded px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          View store
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
