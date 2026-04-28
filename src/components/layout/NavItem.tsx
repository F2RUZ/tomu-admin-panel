// src/components/layout/NavItem.tsx
"use client";

import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, Typography, Tooltip } from "@mui/joy";
import { gsap } from "@/lib/gsap";
import { NavItem as NavItemType } from "@/types/common.types";

interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
}

export default function NavItem({ item, collapsed }: NavItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const isActive =
    pathname === item.path ||
    (item.path !== "/dashboard" && pathname.startsWith(item.path));

  useEffect(() => {
    const el = ref.current;
    if (!el || isActive) return;
    const enter = () => {
      gsap.to(el, { x: 4, duration: 0.2, ease: "power2.out" });
      gsap.to(iconRef.current, { scale: 1.1, duration: 0.2, ease: "back.out(2)" });
    };
    const leave = () => {
      gsap.to(el, { x: 0, duration: 0.2, ease: "power2.out" });
      gsap.to(iconRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [isActive]);

  const content = (
    <Box
      ref={ref}
      onClick={() => router.push(item.path)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 1.5,
        px: collapsed ? 0 : 1.5,
        py: 1,
        borderRadius: "12px",
        cursor: "pointer",
        position: "relative",
        justifyContent: collapsed ? "center" : "flex-start",
        transition: "all 0.2s ease",
        "[data-joy-color-scheme='light'] &": {
          bgcolor: isActive ? "#e0f2fe" : "transparent",
          "&:hover": { bgcolor: isActive ? "#e0f2fe" : "#f1f5f9" },
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: isActive ? "rgba(168,85,247,0.12)" : "transparent",
          "&:hover": { bgcolor: isActive ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.05)" },
        },
      }}
    >
      {isActive && !collapsed && (
        <Box
          sx={{
            position: "absolute", left: 0, top: "50%",
            transform: "translateY(-50%)", width: 3, height: 20,
            borderRadius: "0 4px 4px 0",
            "[data-joy-color-scheme='light'] &": { bgcolor: "#0284c7" },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "#a855f7" },
          }}
        />
      )}
      <Box
        ref={iconRef}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, width: 36, height: 36, borderRadius: "10px",
          "[data-joy-color-scheme='light'] &": {
            bgcolor: isActive ? "#bae6fd" : "transparent",
            color: isActive ? "#0284c7" : "#64748b",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: isActive ? "rgba(168,85,247,0.2)" : "transparent",
            color: isActive ? "#c084fc" : "#71717d",
          },
        }}
      >
        {item.icon}
      </Box>
      {!collapsed && (
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: isActive ? 700 : 500,
            fontSize: "0.8125rem",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            "[data-joy-color-scheme='light'] &": { color: isActive ? "#0284c7" : "#475569" },
            "[data-joy-color-scheme='dark'] &": { color: isActive ? "#c084fc" : "#a1a1aa" },
          }}
        >
          {item.label}
        </Typography>
      )}
    </Box>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" arrow>
        <Box>{content}</Box>
      </Tooltip>
    );
  }

  return content;
}
