// src/app/(dashboard)/live-chat/page.tsx
"use client";

import { Box, Typography } from "@mui/joy";
import LiveChatPriceCard from "@/components/livechat/LiveChatPriceCard";
import LiveChatTable from "@/components/livechat/LiveChatTable";

export default function LiveChatPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1.375rem",
            letterSpacing: "-0.03em",
            color: "text.primary",
          }}
        >
          Jonli chat
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            color: "text.tertiary",
            mt: 0.25,
          }}
        >
          Seanslar va narx sozlamalari
        </Typography>
      </Box>

      {/* Price card */}
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <LiveChatPriceCard />
      </Box>

      {/* Seanslar */}
      <Box
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          overflow: "hidden",
          mb: 0,
          "[data-joy-color-scheme='light'] &": {
            borderColor: "#e2e8f0",
            bgcolor: "#ffffff",
          },
          "[data-joy-color-scheme='dark'] &": {
            borderColor: "#3a3a44",
            bgcolor: "#1c1c21",
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            "[data-joy-color-scheme='light'] &": {
              borderColor: "#e2e8f0",
              bgcolor: "#f8fafc",
            },
            "[data-joy-color-scheme='dark'] &": {
              borderColor: "#3a3a44",
              bgcolor: "#26262d",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "text.primary",
            }}
          >
            Seans so'rovlari
          </Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <LiveChatTable />
        </Box>
      </Box>
    </Box>
  );
}
