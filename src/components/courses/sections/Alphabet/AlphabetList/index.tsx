// src/components/courses/sections/Alphabet/AlphabetList/index.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Input, CircularProgress } from "@mui/joy";
import { RiSearchLine } from "react-icons/ri";
import { Alphabet } from "@/types/alphabet.types";
import AlphabetService from "@/services/alphabetService";
import { useSnackbarStore } from "@/store/snackbarStore";
import AlphabetCard from "@/components/courses/sections/Alphabet/AlphabetCard";
import AlphabetModal from "@/components/courses/sections/Alphabet/AlphabetModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

interface AlphabetListProps {
  courseId: number;
}

export default function AlphabetList({ courseId }: AlphabetListProps) {
  const [alphabets, setAlphabets] = useState<Alphabet[]>([]);
  const [filtered, setFiltered] = useState<Alphabet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Alphabet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Alphabet | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AlphabetService.getByCourse(courseId);
      const data = Array.isArray(res.data) ? res.data : [];
      setAlphabets(data);
      setFiltered(data);
    } catch {
      useSnackbarStore.getState().error("Alifbo darslarini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(alphabets);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(alphabets.filter((a) => a.title.toLowerCase().includes(q)));
  }, [search, alphabets]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await AlphabetService.delete(deleteTarget.id);
      useSnackbarStore.getState().success("Alphabet o'chirildi");
      setDeleteTarget(null);
      await fetchData();
    } catch {
      useSnackbarStore.getState().error("O'chirishda xatolik");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Alifbo darslari"
        subtitle={`Jami ${alphabets.length} ta dars`}
        action={{
          label: "Yangi dars",
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
          placeholder="Dars qidirish..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 360,
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

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress
            sx={{
              "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
              "[data-joy-color-scheme='dark'] &": { color: "#9333ea" },
            }}
          />
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Hech narsa topilmadi" : "Hali alifbo darslari yo'q"}
          description={
            search
              ? "Boshqa kalit so'z bilan qidiring"
              : "Birinchi alifbo darsini yarating"
          }
          action={
            !search
              ? { label: "Dars yaratish", onClick: () => setModalOpen(true) }
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

      {/* Modals */}
      <AlphabetModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={fetchData}
        editData={editData}
        courseId={courseId}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Alphabetni o'chirish"
        message={`"${deleteTarget?.title}" darsini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
