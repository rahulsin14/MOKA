import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLogin = !session;

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] md:flex-row">
      <AdminNav />
      <div className="flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
