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
import { useSnackbarStore } from "@/store/snackbarStore";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { mode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { logout } = useAuth(); // ← useAuth dan logout

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
        overflowY: "auto",
        zIndex: 100,
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
                "[data-joy-color-scheme='light'] &": { bgcolor: "#0284c7", color: "#fff" },
                "[data-joy-color-scheme='dark'] &": { bgcolor: "#9333ea", color: "#fff" },
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
              width: 36, height: 36, borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.875rem",
              fontFamily: "var(--font-montserrat)",
              "[data-joy-color-scheme='light'] &": { bgcolor: "#0284c7", color: "#fff" },
              "[data-joy-color-scheme='dark'] &": { bgcolor: "#9333ea", color: "#fff" },
            }}
          >
            T
          </Box>
        )}

        {!collapsed && (
          <IconButton size="sm" variant="plain" color="neutral" onClick={onToggle} sx={{ borderRadius: "8px" }}>
            <RiMenuFoldLine size={18} />
          </IconButton>
        )}
      </Box>

      {/* ─── Nav ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          py: 1.5, px: collapsed ? 1 : 1.5,
          display: "flex", flexDirection: "column", gap: 0.5,
          "&::-webkit-scrollbar": { width: 0 },
        }}
      >
        {NAV_GROUPS.map((group) => (
          <Box key={group.label} sx={{ mb: 0.5 }}>
            {!collapsed && (
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700, fontSize: "0.6875rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  px: 1.5, py: 0.75, display: "block",
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
          borderTop: "1px solid", borderColor: "divider",
          p: collapsed ? 1 : 1.5,
          display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0,
        }}
      >
        {/* Theme toggle */}
        <Tooltip
          title={mode === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
          placement={collapsed ? "right" : "top"}
          arrow
        >
          <Box
            onClick={toggleTheme}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: collapsed ? 0 : 1.5, py: 1,
              borderRadius: "12px", cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.2s ease",
              "&:hover": {
                "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
                "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(255,255,255,0.05)" },
              },
            }}
          >
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                "[data-joy-color-scheme='light'] &": { color: "#64748b" },
                "[data-joy-color-scheme='dark'] &": { color: "#71717d" },
              }}
            >
              {mode === "dark" ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
            </Box>
            {!collapsed && (
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "0.8125rem",
                  "[data-joy-color-scheme='light'] &": { color: "#475569" },
                  "[data-joy-color-scheme='dark'] &": { color: "#a1a1aa" },
                }}
              >
                {mode === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
              </Typography>
            )}
          </Box>
        </Tooltip>

        {/* User + logout */}
        {user && (
          <Box
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: collapsed ? 0 : 1.5, py: 1,
              borderRadius: "12px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.75rem",
                fontFamily: "var(--font-montserrat)", flexShrink: 0,
                "[data-joy-color-scheme='light'] &": { bgcolor: "#e0f2fe", color: "#0284c7" },
                "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(168,85,247,0.15)", color: "#c084fc" },
              }}
            >
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </Box>

            {!collapsed && (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 600,
                      fontSize: "0.8125rem", color: "text.primary",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.6875rem", color: "text.tertiary",
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {user.role}
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
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: "10px",
                cursor: "pointer", mx: "auto", transition: "all 0.2s ease",
                "&:hover": {
                  "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
                  "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(255,255,255,0.05)" },
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
