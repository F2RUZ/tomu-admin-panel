// src/components/courses/CourseList/index.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Input, CircularProgress } from "@mui/joy";
import { RiSearchLine } from "react-icons/ri";
import { Course } from "@/types/course.types";
import CourseService from "@/services/courseService";
import { useSnackbarStore } from "@/store/snackbarStore";
import CourseCard from "@/components/courses/CourseCard";
import CourseModal from "@/components/courses/CourseModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseService.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setCourses(data);
      setFiltered(data);
    } catch {
      useSnackbarStore.getState().error("Kurslarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(courses);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      ),
    );
  }, [search, courses]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await CourseService.delete(deleteTarget.id);
      useSnackbarStore.getState().success("Kurs o'chirildi");
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
        title="Kurslar"
        subtitle={`Jami ${courses.length} ta kurs`}
        action={{
          label: "Yangi kurs",
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
          placeholder="Kurs qidirish..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 400,
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
      </Box>

      {/* Grid */}
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
          title={search ? "Hech narsa topilmadi" : "Hali kurs yo'q"}
          description={
            search
              ? "Boshqa kalit so'z bilan qidiring"
              : "Birinchi kursni yarating"
          }
          action={
            !search
              ? { label: "Kurs yaratish", onClick: () => setModalOpen(true) }
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
            },
            gap: 2.5,
          }}
        >
          {filtered.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onEdit={(c) => {
                setEditData(c);
                setModalOpen(true);
              }}
              onDelete={(c) => setDeleteTarget(c)}
            />
          ))}
        </Box>
      )}

      {/* Modals */}
      <CourseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={fetchData}
        editData={editData}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Kursni o'chirish"
        message={`"${deleteTarget?.title}" kursini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
