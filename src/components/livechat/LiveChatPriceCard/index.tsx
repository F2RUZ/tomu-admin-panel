"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Input, Button, CircularProgress } from "@mui/joy";
import { RiMoneyDollarCircleLine, RiSaveLine, RiEditLine } from "react-icons/ri";
import LiveChatService from "@/services/liveChatService";
import { useSnackbarStore } from "@/store/snackbarStore";

export default function LiveChatPriceCard() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["livechatPrice"],
    queryFn: LiveChatService.getPrice,
    select: (res: any) => Array.isArray(res.data) ? res.data[0] : null,
  });

  const updateMutation = useMutation({
    mutationFn: (price: number) => LiveChatService.updatePrice(1, price),
    onSuccess: () => {
      useSnackbarStore.getState().success("Narx yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["livechatPrice"] });
      setEditing(false);
    },
    onError: () => useSnackbarStore.getState().error("Xatolik yuz berdi"),
  });

  const handleEdit = () => {
    setNewPrice(String(data?.price ?? ""));
    setEditing(true);
  };

  const handleSave = () => {
    const price = Number(newPrice);
    if (!newPrice || isNaN(price) || price < 1) {
      useSnackbarStore.getState().error("To'g'ri narx kiriting");
      return;
    }
    updateMutation.mutate(price);
  };

  return (
    <Box sx={{
      p: 2.5, borderRadius: "12px", border: "1px solid", mb: 3,
      "[data-joy-color-scheme='light'] &": { bgcolor: "#ffffff", borderColor: "#e2e8f0" },
      "[data-joy-color-scheme='dark'] &": { bgcolor: "#1c1c21", borderColor: "#3a3a44" },
    }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            "[data-joy-color-scheme='light'] &": { bgcolor: "#f3e8ff", color: "#9333ea" },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(147,51,234,0.12)", color: "#c084fc" },
          }}>
            <RiMoneyDollarCircleLine size={20} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "text.primary" }}>
              Jonli chat narxi
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "text.tertiary" }}>
              1 daqiqa uchun narx (so'mda)
            </Typography>
          </Box>
        </Box>
        {!editing && (
          <Button
            size="sm"
            startDecorator={<RiEditLine size={14} />}
            onClick={handleEdit}
            sx={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600,
              borderRadius: "8px", border: "none",
              "[data-joy-color-scheme='light'] &": { bgcolor: "#f3e8ff", color: "#9333ea", "&:hover": { bgcolor: "#e9d5ff" } },
              "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(147,51,234,0.1)", color: "#c084fc", "&:hover": { bgcolor: "rgba(147,51,234,0.2)" } },
            }}
          >
            O'zgartirish
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size="sm" />
        </Box>
      ) : editing ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Narx kiriting..."
            disabled={updateMutation.isPending}
            sx={{
              flex: 1, borderRadius: "8px", fontFamily: "var(--font-montserrat)",
              "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc", borderColor: "#e2e8f0", "& input": { color: "#0f172a" } },
              "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d", borderColor: "#3a3a44", "& input": { color: "#fafafa" } },
            }}
          />
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            startDecorator={updateMutation.isPending
              ? <CircularProgress size="sm" sx={{ "--CircularProgress-size": "16px" }} />
              : <RiSaveLine size={14} />
            }
            sx={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700,
              borderRadius: "8px", border: "none",
              "[data-joy-color-scheme='light'] &": { bgcolor: "#9333ea", color: "#fff", "&:hover": { bgcolor: "#7e22ce" } },
              "[data-joy-color-scheme='dark'] &": { bgcolor: "#9333ea", color: "#fff", "&:hover": { bgcolor: "#7e22ce" } },
            }}
          >
            {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
          <Button
            variant="plain" color="neutral" onClick={() => setEditing(false)}
            disabled={updateMutation.isPending}
            sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, borderRadius: "8px" }}
          >
            Bekor
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography sx={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "2rem", letterSpacing: "-0.03em",
            "[data-joy-color-scheme='light'] &": { color: "#9333ea" },
            "[data-joy-color-scheme='dark'] &": { color: "#c084fc" },
          }}>
            {Number(data?.price ?? 0).toLocaleString("uz-UZ")}
          </Typography>
          <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "text.tertiary" }}>
            so'm / daqiqa
          </Typography>
        </Box>
      )}
    </Box>
  );
}
