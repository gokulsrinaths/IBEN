import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid var(--line)",
          fontSize: 13,
        }}
      >
        <strong style={{ fontFamily: "var(--font-serif)", fontSize: 16 }}>
          IBEN Admin
        </strong>
        <Link href="/admin/submissions">Submissions</Link>
        <Link href="/admin/professionals">Professionals</Link>
        <div style={{ marginLeft: "auto" }}>
          <LogoutButton />
        </div>
      </nav>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
