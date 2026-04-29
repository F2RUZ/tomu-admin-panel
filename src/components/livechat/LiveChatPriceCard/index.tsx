// src/components/livechat/LiveChatPriceCard/index.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Input,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
} from "@mui/joy";
import {
  RiPriceTagLine,
  RiEditLine,
  RiSaveLine,
  RiCloseLine,
} from "react-icons/ri";
import LiveChatService from "@/services/liveChatService";
import { useSnackbarStore } from "@/store/snackbarStore";

export default function LiveChatPriceCard() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["livechatPrice"],
    queryFn: LiveChatService.getPrice,
    select: (res) => res.data?.[0] ?? null,
  });

  const updateMutation = useMutation({
    mutationFn: (price: number) =>
      LiveChatService.updatePrice(data?.id ?? 1, price),
    onSuccess: () => {
      useSnackbarStore.getState().success("Narx yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["livechatPrice"] });
      setEditing(false);
    },
    onError: () =>
      useSnackbarStore.getState().error("Narxni yangilashda xatolik"),
  });

  const handleEdit = () => {
    setNewPrice(String(data?.price ?? ""));
    setEditing(true);
  };

  const handleSave = () => {
    const price = Number(newPrice);
    if (isNaN(price) || price < 0) {
      useSnackbarStore.getState().error("To'g'ri narx kiriting");
      return;
    }
    updateMutation.mutate(price);
  };

  const shimmer = {
    borderRadius: "8px",
    "@keyframes shimmer": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.35 },
      "100%": { opacity: 1 },
    },
    animation: "shimmer 1.4s ease-in-out infinite",
    "[data-joy-color-scheme='light'] &": { bgcolor: "#e2e8f0" },
    "[data-joy-color-scheme='dark'] &": { bgcolor: "#3a3a44" },
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        p: 3,
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "#ffffff",
          borderColor: "#e2e8f0",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "#1c1c21",
          borderColor: "#3a3a44",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#f3e8ff",
                color: "#9333ea",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(147,51,234,0.12)",
                color: "#c084fc",
              },
            }}
          >
            <RiPriceTagLine size={20} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              Live Chat narxi
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                color: "text.tertiary",
              }}
            >
              1 daqiqa uchun narx
            </Typography>
          </Box>
        </Box>

        {!editing && (
          <Button
            size="sm"
            variant="soft"
            startDecorator={<RiEditLine size={15} />}
            onClick={handleEdit}
            disabled={isLoading}
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              borderRadius: "8px",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#f3e8ff",
                color: "#9333ea",
                "&:hover": { bgcolor: "#e9d5ff" },
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(147,51,234,0.12)",
                color: "#c084fc",
                "&:hover": { bgcolor: "rgba(147,51,234,0.2)" },
              },
            }}
          >
            Tahrirlash
          </Button>
        )}
      </Box>

      {/* Price display / edit */}
      {isLoading ? (
        <Box sx={{ ...shimmer, width: 160, height: 48 }} />
      ) : editing ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                mb: 0.75,
              }}
            >
              Yangi narx (som)
            </FormLabel>
            <Input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Masalan: 1000"
              slotProps={{ input: { min: 0 } }}
              autoFocus
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.125rem",
                fontWeight: 700,
                borderRadius: "8px",
                height: 48,
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  "& input": { color: "#0f172a" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#26262d",
                  borderColor: "#3a3a44",
                  "& input": { color: "#fafafa" },
                },
              }}
            />
          </FormControl>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="plain"
              color="neutral"
              startDecorator={<RiCloseLine size={16} />}
              onClick={() => setEditing(false)}
              disabled={updateMutation.isPending}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              Bekor
            </Button>
            <Button
              startDecorator={
                updateMutation.isPending ? (
                  <CircularProgress
                    size="sm"
                    sx={{ "--CircularProgress-size": "16px" }}
                  />
                ) : (
                  <RiSaveLine size={16} />
                )
              }
              onClick={handleSave}
              disabled={updateMutation.isPending}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                borderRadius: "8px",
                border: "none",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                },
              }}
            >
              {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "2.5rem",
              letterSpacing: "-0.04em",
              "[data-joy-color-scheme='light'] &": { color: "#9333ea" },
              "[data-joy-color-scheme='dark'] &": { color: "#c084fc" },
            }}
          >
            {Number(data?.price ?? 0).toLocaleString("uz-UZ")}
            <Box
              component="span"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                ml: 0.75,
                color: "text.tertiary",
              }}
            >
              som/daq
            </Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: "text.tertiary",
              mt: 0.5,
            }}
          >
            Oxirgi yangilangan:{" "}
            {data?.lastUpdatedAt
              ? new Date(data.lastUpdatedAt).toLocaleDateString("uz-UZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "—"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
