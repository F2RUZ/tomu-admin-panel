"use client";

import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, Typography } from "@mui/joy";
import { gsap } from "@/lib/gsap";
import { NavItem as NavItemType } from "@/types/common.types";
import { cn } from "@/utils/cn";

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

  // GSAP hover
  useEffect(() => {
    const el = ref.current;
    if (!el || isActive) return;

    const enter = () => {
      gsap.to(el, { x: 4, duration: 0.2, ease: "power2.out" });
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: "back.out(2)",
      });
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

  return (
    <Box
      ref={ref}
      onClick={() => router.push(item.path)}
      title={collapsed ? item.label : undefined}
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

        // Active state
        ...(isActive
          ? {
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#e0f2fe",
                "& .nav-label": { color: "#0284c7", fontWeight: 700 },
                "& .nav-icon": { color: "#0284c7" },
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(168,85,247,0.12)",
                "& .nav-label": { color: "#c084fc", fontWeight: 700 },
                "& .nav-icon": { color: "#c084fc" },
              },
            }
          : {
              "&:hover": {
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#f1f5f9",
                },
                bgcolor: "rgba(255,255,255,0.05)",
              },
              "& .nav-label": { color: "text.secondary" },
              "& .nav-icon": { color: "text.tertiary" },
            }),
      }}
    >
      {/* Active indicator */}
      {isActive && !collapsed && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 20,
            borderRadius: "0 4px 4px 0",
            "[data-joy-color-scheme='light'] &": { bgcolor: "#0284c7" },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "#a855f7" },
          }}
        />
      )}

      {/* Icon */}
      <Box
        ref={iconRef}
        className="nav-icon"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "10px",
          transition: "color 0.2s ease",
          ...(isActive && {
            "[data-joy-color-scheme='light'] &": {
              bgcolor: "#bae6fd",
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "rgba(168,85,247,0.2)",
            },
          }),
        }}
      >
        {item.icon}
      </Box>

      {/* Label */}
      {!collapsed && (
        <Typography
          className="nav-label"
          level="body-sm"
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 500,
            fontSize: "0.8125rem",
            transition: "color 0.2s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.label}
        </Typography>
      )}

      {/* Badge */}
      {item.badge && !collapsed && (
        <Box
          sx={{
            ml: "auto",
            minWidth: 20,
            height: 20,
            borderRadius: "99px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6875rem",
            fontWeight: 700,
            "[data-joy-color-scheme='light'] &": {
              bgcolor: "#0284c7",
              color: "#fff",
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "#9333ea",
              color: "#fff",
            },
          }}
        >
          {item.badge}
        </Box>
      )}
    </Box>
  );
}
