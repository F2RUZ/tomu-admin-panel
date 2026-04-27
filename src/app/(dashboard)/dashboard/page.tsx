// src/app/(dashboard)/dashboard/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | TOMU Admin",
};

export default function DashboardPage() {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700 }}>
        Dashboard
      </h1>
      <p style={{ marginTop: "8px", color: "#64748b" }}>
        TOMU Admin Panel ga xush kelibsiz!
      </p>
    </div>
  );
}
