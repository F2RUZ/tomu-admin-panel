// src/components/layout/Sidebar.tsx
"use client";

import { useRef } from "react";
import { Box, Typography, IconButton, Divider, Tooltip } from "@mui/joy";
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiSunLine,
  RiMoonLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { NAV_GROUPS } from "@/constants/navItems";
import NavItem from "./NavItem";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/utils/format";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  director: "Direktor",
  teacher: "O'qituvchi",
};

const ROLE_COLORS: Record<
  string,
  { light: string; dark: string; bgLight: string; bgDark: string }
> = {
  admin: {
    light: "#0284c7",
    dark: "#38bdf8",
    bgLight: "#e0f2fe",
    bgDark: "rgba(2,132,199,0.1)",
  },
  director: {
    light: "#dc2626",
    dark: "#f87171",
    bgLight: "#fff1f2",
    bgDark: "rgba(248,113,113,0.08)",
  },
  teacher: {
    light: "#9333ea",
    dark: "#c084fc",
    bgLight: "#f3e8ff",
    bgDark: "rgba(147,51,234,0.1)",
  },
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { mode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const userRole = user?.role?.toLowerCase() ?? "";
  const roleColor = ROLE_COLORS[userRole] ?? ROLE_COLORS.admin;

  // Role bo'yicha menyu filtrlash
  const filteredGroups = NAV_GROUPS.filter((group) =>
    group.roles.includes(userRole),
  )
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 260,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 100,
        overflowY: "auto",
        overflowX: "hidden",
        "[data-joy-color-scheme='light'] &": { bgcolor: "#ffffff" },
        "[data-joy-color-scheme='dark'] &": { bgcolor: "#18181b" },
      }}
    >
      {/* ─── Logo ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 0 : 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.875rem",
                fontFamily: "var(--font-montserrat)",
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
              T
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "1.125rem",
                letterSpacing: "-0.03em",
                "[data-joy-color-scheme='light'] &": { color: "#0f172a" },
                "[data-joy-color-scheme='dark'] &": { color: "#fafafa" },
              }}
            >
              TOMU
            </Typography>
          </Box>
        )}
        {collapsed && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.875rem",
              fontFamily: "var(--font-montserrat)",
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
            T
          </Box>
        )}
        {!collapsed && (
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={onToggle}
            sx={{ borderRadius: "8px" }}
          >
            <RiMenuFoldLine size={18} />
          </IconButton>
        )}
      </Box>

      {/* ─── Role badge ───────────────────────────────────────────── */}
      {!collapsed && userRole && (
        <Box
          sx={{
            mx: 1.5,
            mt: 1.5,
            px: 1.5,
            py: 0.75,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "[data-joy-color-scheme='light'] &": { bgcolor: roleColor.bgLight },
            "[data-joy-color-scheme='dark'] &": { bgcolor: roleColor.bgDark },
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              "[data-joy-color-scheme='light'] &": { bgcolor: roleColor.light },
              "[data-joy-color-scheme='dark'] &": { bgcolor: roleColor.dark },
            }}
          />
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              fontSize: "0.75rem",
              "[data-joy-color-scheme='light'] &": { color: roleColor.light },
              "[data-joy-color-scheme='dark'] &": { color: roleColor.dark },
            }}
          >
            {ROLE_LABELS[userRole] ?? userRole}
          </Typography>
        </Box>
      )}

      {/* ─── Nav ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.5,
          px: collapsed ? 1 : 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          "&::-webkit-scrollbar": { width: 0 },
        }}
      >
        {filteredGroups.map((group) => (
          <Box key={group.label} sx={{ mb: 0.5 }}>
            {!collapsed && (
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  px: 1.5,
                  py: 0.75,
                  display: "block",
                  "[data-joy-color-scheme='light'] &": { color: "#94a3b8" },
                  "[data-joy-color-scheme='dark'] &": { color: "#52525e" },
                }}
              >
                {group.label}
              </Typography>
            )}
            {collapsed && <Divider sx={{ my: 0.5, mx: 1, opacity: 0.4 }} />}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* ─── Bottom ───────────────────────────────────────────────── */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          p: collapsed ? 1 : 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          flexShrink: 0,
        }}
      >
        {/* User + logout */}
        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: collapsed ? 0 : 1.5,
              py: 1,
              borderRadius: "12px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.75rem",
                fontFamily: "var(--font-montserrat)",
                flexShrink: 0,
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: roleColor.bgLight,
                  color: roleColor.light,
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: roleColor.bgDark,
                  color: roleColor.dark,
                },
              }}
            >
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </Box>
            {!collapsed && (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: "text.primary",
                      whiteSpace: "nowrap",
                      overflowY: "auto",
                      overflowX: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.6875rem",
                      color: "text.tertiary",
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {ROLE_LABELS[userRole] ?? userRole}
                  </Typography>
                </Box>
                <Tooltip title="Chiqish" placement="top" arrow>
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={logout}
                    sx={{ borderRadius: "8px", flexShrink: 0 }}
                  >
                    <RiLogoutBoxLine size={16} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )}

        {/* Collapse toggle */}
        {collapsed && (
          <Tooltip title="Kengaytirish" placement="right" arrow>
            <Box
              onClick={onToggle}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "10px",
                cursor: "pointer",
                mx: "auto",
                transition: "all 0.2s ease",
                "&:hover": {
                  "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                },
                "[data-joy-color-scheme='light'] &": { color: "#64748b" },
                "[data-joy-color-scheme='dark'] &": { color: "#71717d" },
              }}
            >
              <RiMenuUnfoldLine size={18} />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
