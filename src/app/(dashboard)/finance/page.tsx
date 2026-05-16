"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/joy";
import {
  RiExchangeLine,
  RiMoneyDollarCircleLine,
  RiMessage3Line,
  RiChat1Line,
} from "react-icons/ri";
import OrderTable from "@/components/orders/OrderTable";
import CoursePaymentTable from "@/components/payments/CoursePaymentTable";
import LiveChatTable from "@/components/livechat/LiveChatTable";
import LiveChatPriceCard from "@/components/livechat/LiveChatPriceCard";

const TABS = [
  { key: "orders", label: "Buyurtmalar", icon: <RiExchangeLine size={16} /> },
  { key: "course", label: "Kurs to'lovlari", icon: <RiMoneyDollarCircleLine size={16} /> },
  { key: "livechat", label: "Jonli chat", icon: <RiMessage3Line size={16} /> },
];

export default function FinancePage() {
  const [tab, setTab] = useState("orders");

  return (
    <Box>
      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mb: 3,
          p: 0.5,
          borderRadius: "12px",
          width: "fit-content",
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#18181b" },
        }}
      >
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <Box
              key={t.key}
              onClick={() => setTab(t.key)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-montserrat)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.875rem",
                ...(isActive
                  ? {
                      "[data-joy-color-scheme='light'] &": {
                        bgcolor: "#ffffff",
                        color: "#0284c7",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        bgcolor: "#1c1c21",
                        color: "#c084fc",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      },
                    }
                  : {
                      "[data-joy-color-scheme='light'] &": {
                        color: "#64748b",
                        "&:hover": { color: "#0f172a" },
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        color: "#71717d",
                        "&:hover": { color: "#fafafa" },
                      },
                    }),
              }}
            >
              {t.icon}
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: "inherit",
                  fontSize: "inherit",
                  color: "inherit",
                }}
              >
                {t.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Content */}
      {tab === "orders" && <OrderTable />}
      {tab === "course" && <CoursePaymentTable />}
{tab === "livechat" && (
        <>
          <LiveChatPriceCard />
          <LiveChatTable />
        </>
      )}
    </Box>
  );
}
