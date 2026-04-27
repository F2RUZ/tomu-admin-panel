"use client";

import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/joy";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { pageEnter } from "@/lib/gsap";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pageEnter(mainRef.current);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
        "[data-joy-color-scheme='dark'] &": { bgcolor: "#0e0e12" },
      }}
    >
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Right side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Header />

        {/* Main content */}
        <Box
          ref={mainRef}
          component="main"
          className="page-wrapper"
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
