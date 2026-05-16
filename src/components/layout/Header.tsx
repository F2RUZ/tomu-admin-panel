"use client";

import { useRef, useState } from "react";
import { Box, Typography, IconButton, Input, Badge, Avatar } from "@mui/joy";
import {
  RiSearchLine,
  RiBellLine,
  RiSunLine,
  RiMoonLine,
  RiUser3Line,
  RiSettings4Line,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { NAV_ITEMS } from "@/constants/navItems";
import { getInitials } from "@/utils/format";

export default function Header() {
  const { mode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { success } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active page title
  const activeNav = NAV_ITEMS.find(
    (item) =>
      pathname === item.path ||
      (item.path !== "/dashboard" && pathname.startsWith(item.path)),
  );

  const handleLogout = () => {
    logout();
    success("Tizimdan chiqdingiz");
    router.push(ROUTES.LOGIN);
    setDropdownOpen(false);
  };

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 99,
        backdropFilter: "blur(12px)",
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "rgba(255,255,255,0.85)",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "rgba(24,24,27,0.85)",
        },
      }}
    >
      {/* ─── Left: Page title ─────────────────────────────────────── */}
      <Box>
        <Typography
          level="title-md"
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          {activeNav?.label ?? "Dashboard"}
        </Typography>
        <Typography
          level="body-xs"
          sx={{
            fontFamily: "var(--font-montserrat)",
            color: "text.tertiary",
            fontSize: "0.75rem",
          }}
        >
          TOMU Admin Panel
        </Typography>
      </Box>

      {/* ─── Right: Actions ───────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Search */}
        <Input
          size="sm"
          placeholder="Qidirish..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            width: 220,
            borderRadius: "10px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8125rem",
            display: { xs: "none", md: "flex" },
            "[data-joy-color-scheme='light'] &": {
              bgcolor: "#f1f5f9",
              border: "1px solid #e2e8f0",
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "#26262d",
              border: "1px solid #3a3a44",
            },
          }}
        />

        {/* Theme toggle */}
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={toggleTheme}
          sx={{
            borderRadius: "10px",
            width: 36,
            height: 36,
            "[data-joy-color-scheme='light'] &": {
              color: "#64748b",
              "&:hover": { bgcolor: "#f1f5f9" },
            },
            "[data-joy-color-scheme='dark'] &": {
              color: "#71717d",
              "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
            },
          }}
        >
          {mode === "dark" ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
        </IconButton>

   

        {/* User avatar + dropdown */}
        <Box sx={{ position: "relative" }}>
          <Box
            onClick={() => setDropdownOpen((v) => !v)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.75rem",
                fontFamily: "var(--font-montserrat)",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#e0f2fe",
                  color: "#0284c7",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(168,85,247,0.15)",
                  color: "#c084fc",
                },
              }}
            >
              {user ? getInitials(`${user.firstName} ${user.lastName}`) : "A"}
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                level="body-xs"
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {user?.firstName ?? "Admin"}
              </Typography>
              <Typography
                level="body-xs"
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.6875rem",
                  color: "text.tertiary",
                  lineHeight: 1.2,
                }}
              >
                {user?.role ?? "admin"}
              </Typography>
            </Box>
          </Box>

      
        </Box>
      </Box>
    </Box>
  );
}
