// src/components/courses/sections/Tariffs/TariffTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, IconButton, Tooltip, Input } from "@mui/joy";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiPriceTagLine,
  RiTimeLine,
  RiCheckLine,
  RiSearchLine,
} from "react-icons/ri";
import { Tariff } from "@/types/tariff.types";
import TariffService from "@/services/tariffService";
import { useSnackbarStore } from "@/store/snackbarStore";
import TariffModal from "@/components/courses/sections/Tariffs/TariffModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

interface TariffTableProps {
  courseId: number;
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  const s = {
    borderRadius: "6px",
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
        p: 2.5,
        "[data-joy-color-scheme='light'] &": {
          borderColor: "#e2e8f0",
          bgcolor: "#fff",
        },
        "[data-joy-color-scheme='dark'] &": {
          borderColor: "#3a3a44",
          bgcolor: "#1c1c21",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ ...s, width: 40, height: 40, borderRadius: "8px" }} />
        <Box sx={{ display: "flex", gap: 0.75 }}>
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
        </Box>
      </Box>
      <Box sx={{ ...s, width: "60%", height: 20, mb: 1 }} />
      <Box sx={{ ...s, width: "40%", height: 28, mb: 2 }} />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Box sx={{ ...s, width: 80, height: 24, borderRadius: "6px" }} />
        <Box sx={{ ...s, width: 80, height: 24, borderRadius: "6px" }} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ ...s, width: "80%", height: 14 }} />
        ))}
      </Box>
    </Box>
  );
}

export default function TariffTable({ courseId }: TariffTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Tariff | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tariff | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tariffs", courseId],
    queryFn: () => TariffService.getByCourse(courseId),
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const tariffs = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TariffService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Tarif o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["tariffs", courseId] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return tariffs;
    const q = search.toLowerCase();
    return tariffs.filter((t) => t.name.toLowerCase().includes(q));
  }, [search, tariffs]);

  const formatPrice = (price: number) =>
    Number(price).toLocaleString("uz-UZ") + " so'm";

  return (
    <Box>
      <PageHeader
        title="Tariflar"
        subtitle={`Jami ${tariffs.length} ta tarif`}
        action={{
          label: "Yangi tarif",
          onClick: () => {
            setEditData(null);
            setModalOpen(true);
          },
        }}
      />

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tarif qidirish..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 320,
            borderRadius: "8px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
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
      </Box>

      {/* Cards grid */}
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Hech narsa topilmadi" : "Hali tariflar yo'q"}
          description={
            search
              ? "Boshqa kalit so'z bilan qidiring"
              : "Birinchi tarifni yarating"
          }
          action={
            !search
              ? { label: "Tarif yaratish", onClick: () => setModalOpen(true) }
              : undefined
          }
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {filtered.map((tariff, index) => (
            <Box
              key={tariff.id}
              sx={{
                borderRadius: "8px",
                border: "2px solid",
                p: 2.5,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  "[data-joy-color-scheme='light'] &": {
                    boxShadow: "0 8px 24px rgba(147,51,234,0.12)",
                    borderColor: "#9333ea",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    boxShadow: "0 8px 24px rgba(147,51,234,0.2)",
                    borderColor: "#9333ea",
                  },
                },
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
              {/* Top accent */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  borderRadius: "8px 8px 0 0",
                  background: `linear-gradient(90deg, #9333ea, #c084fc)`,
                }}
              />

              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
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

                <Box sx={{ display: "flex", gap: 0.75 }}>
                  <Tooltip title="Tahrirlash" placement="top" arrow>
                    <IconButton
                      size="sm"
                      variant="soft"
                      onClick={() => {
                        setEditData(tariff);
                        setModalOpen(true);
                      }}
                      sx={{
                        borderRadius: "8px",
                        "[data-joy-color-scheme='light'] &": {
                          bgcolor: "#f3e8ff",
                          color: "#9333ea",
                          "&:hover": { bgcolor: "#e9d5ff" },
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          bgcolor: "rgba(147,51,234,0.1)",
                          color: "#c084fc",
                          "&:hover": { bgcolor: "rgba(147,51,234,0.2)" },
                        },
                      }}
                    >
                      <RiEditLine size={14} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="O'chirish" placement="top" arrow>
                    <IconButton
                      size="sm"
                      variant="soft"
                      onClick={() => setDeleteTarget(tariff)}
                      sx={{
                        borderRadius: "8px",
                        "[data-joy-color-scheme='light'] &": {
                          bgcolor: "#fff1f2",
                          color: "#dc2626",
                          "&:hover": { bgcolor: "#fecdd3" },
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          bgcolor: "rgba(248,113,113,0.08)",
                          color: "#f87171",
                          "&:hover": { bgcolor: "rgba(248,113,113,0.15)" },
                        },
                      }}
                    >
                      <RiDeleteBinLine size={14} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Name */}
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                {tariff.name}
              </Typography>

              {/* Price */}
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.03em",
                  mb: 1.5,
                  "[data-joy-color-scheme='light'] &": { color: "#9333ea" },
                  "[data-joy-color-scheme='dark'] &": { color: "#c084fc" },
                }}
              >
                {formatPrice(tariff.price)}
              </Typography>

              {/* Duration badge */}
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: "6px",
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
                  <RiTimeLine size={13} />
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                    }}
                  >
                    {tariff.duration} kun
                  </Typography>
                </Box>
              </Box>

              {/* Options */}
              {tariff.options && tariff.options.length > 0 && (
                <Box
                  sx={{
                    pt: 1.5,
                    borderTop: "1px solid",
                    "[data-joy-color-scheme='light'] &": {
                      borderColor: "#f1f5f9",
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      borderColor: "#26262d",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                  >
                    {tariff.options.map((opt, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.125,
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
                          <RiCheckLine size={11} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.8125rem",
                            color: "text.secondary",
                            lineHeight: 1.5,
                          }}
                        >
                          {opt}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      <TariffModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["tariffs", courseId] })
        }
        editData={editData}
        courseId={courseId}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Tarifni o'chirish"
        message={`"${deleteTarget?.name}" tarifini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
