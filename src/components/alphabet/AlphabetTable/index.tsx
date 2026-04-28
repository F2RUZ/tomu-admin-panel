// src/components/alphabet/AlphabetTable/index.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Input,
  Button,
  Modal,
  ModalDialog,
  CircularProgress,
} from "@mui/joy";
import {
  RiSearchLine,
  RiAddLine,
  RiDeleteBinLine,
  RiAlertLine,
} from "react-icons/ri";
import { Alphabet } from "@/types/alphabet.types";
import AlphabetService from "@/services/alphabetService";
import { useSnackbarStore } from "@/store/snackbarStore";
import AlphabetCard from "@/components/alphabet/AlphabetCard";
import AlphabetModal from "@/components/alphabet/AlphabetModal";

interface AlphabetTableProps {
  courses: { id: number; title: string }[];
}

export default function AlphabetTable({ courses }: AlphabetTableProps) {
  const [alphabets, setAlphabets] = useState<Alphabet[]>([]);
  const [filtered, setFiltered] = useState<Alphabet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Alphabet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Alphabet | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AlphabetService.getAll();
      setAlphabets(res.data);
      setFiltered(res.data);
    } catch {
      useSnackbarStore.getState().error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Search ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(alphabets);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      alphabets.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.course?.title.toLowerCase().includes(q),
      ),
    );
  }, [search, alphabets]);

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await AlphabetService.delete(deleteTarget.id);
      useSnackbarStore
        .getState()
        .success("Alphabet o'chirildi", "Muvaffaqiyat");
      setDeleteTarget(null);
      fetchData();
    } catch {
      useSnackbarStore.getState().error("O'chirishda xatolik yuz berdi");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      {/* ─── Header ───────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Alifbo darslar
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
              mt: 0.25,
            }}
          >
            Jami {alphabets.length} ta alifbo darsi
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qidirish..."
            startDecorator={<RiSearchLine size={16} />}
            sx={{
              width: 220,
              borderRadius: "10px",
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
          <Button
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
            startDecorator={<RiAddLine size={18} />}
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              borderRadius: "10px",
              height: 40,
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#0284c7",
                color: "#fff",
                "&:hover": { bgcolor: "#0369a1" },
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "#9333ea",
                color: "#fff",
                "&:hover": { bgcolor: "#7e22ce" },
              },
            }}
          >
            Yangi qoshish
          </Button>
        </Box>
      </Box>

      {/* ─── Grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress
            sx={{
              "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
              "[data-joy-color-scheme='dark'] &": { color: "#9333ea" },
            }}
          />
        </Box>
      ) : filtered.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            gap: 1.5,
            borderRadius: "16px",
            border: "2px dashed",
            "[data-joy-color-scheme='light'] &": {
              borderColor: "#e2e8f0",
              bgcolor: "#f8fafc",
            },
            "[data-joy-color-scheme='dark'] &": {
              borderColor: "#3a3a44",
              bgcolor: "#1c1c21",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {search ? "Hech narsa topilmadi" : "Hali alifbo darslari yo'q"}
          </Typography>
          {!search && (
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              startDecorator={<RiAddLine size={16} />}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              Birinchisini yarating
            </Button>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
              xl: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          {filtered.map((alphabet, index) => (
            <AlphabetCard
              key={alphabet.id}
              alphabet={alphabet}
              index={index}
              onEdit={(a) => {
                setEditData(a);
                setModalOpen(true);
              }}
              onDelete={(a) => setDeleteTarget(a)}
            />
          ))}
        </Box>
      )}

      {/* ─── Create/Edit Modal ────────────────────────────────────── */}
      <AlphabetModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={fetchData}
        editData={editData}
        courses={courses}
      />

      {/* ─── Delete Confirm Modal ─────────────────────────────────── */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <ModalDialog
          sx={{
            width: { xs: "90vw", sm: 400 },
            borderRadius: "20px",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#fff1f2",
                  color: "#dc2626",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(248,113,113,0.1)",
                  color: "#f87171",
                },
              }}
            >
              <RiAlertLine size={28} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Ochirishni tasdiqlang
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  color: "text.secondary",
                }}
              >
                <b>{deleteTarget?.title}</b> ochiriladi. Bu amalni qaytarib
                bolmaydi.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
              <Button
                variant="plain"
                color="neutral"
                fullWidth
                onClick={() => setDeleteTarget(null)}
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  borderRadius: "10px",
                }}
              >
                Bekor qilish
              </Button>
              <Button
                fullWidth
                onClick={handleDelete}
                disabled={deleteLoading}
                startDecorator={
                  deleteLoading ? (
                    <CircularProgress
                      size="sm"
                      sx={{ "--CircularProgress-size": "16px" }}
                    />
                  ) : (
                    <RiDeleteBinLine size={16} />
                  )
                }
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  borderRadius: "10px",
                  bgcolor: "#dc2626",
                  color: "#fff",
                  "&:hover": { bgcolor: "#b91c1c" },
                }}
              >
                {deleteLoading ? "O'chirilmoqda..." : "O'chirish"}
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
