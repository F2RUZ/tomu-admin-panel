// src/components/layout/DashboardLayout.tsx
"use client";

import { useState } from "react";
import { Box } from "@mui/joy";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row", // ← Sidebar chap, content o'ng
        "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
        "[data-joy-color-scheme='dark'] &": { bgcolor: "#0e0e12" },
      }}
    >
      {/* ── Sidebar — chap tomon ── */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* ── O'ng tomon: Header + Content ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
