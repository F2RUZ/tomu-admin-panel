"use client";

import { useParams } from "next/navigation"; // ✅ use(params) o'rniga
import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/joy";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiSaveLine,
  RiCloseLine,
  RiStackLine,
} from "react-icons/ri";
import BlockService from "@/services/blockService";
import BlockAccordion from "@/components/courses/sections/Lessons/BlockAccordion";
import EmptyState from "@/components/ui/EmptyState";
import { Block } from "@/types/block.types";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
} from "@mui/joy";
import { useSnackbarStore } from "@/store/snackbarStore";

// ─── Block Modal ──────────────────────────────────────────────────────────────
function BlockModal({
  open,
  onClose,
  onSuccess,
  courseId,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseId: number;
  editData?: Block | null;
}) {
  const [title, setTitle] = useState(editData?.title ?? "");
  const [order, setOrder] = useState(String(editData?.order ?? ""));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; order?: string }>({});
  const isEdit = !!editData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!order || isNaN(Number(order)) || Number(order) < 1)
      errs.order = "Musbat son kiriting";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      if (isEdit && editData) {
        await BlockService.update(editData.id, { title, order: Number(order) });
        useSnackbarStore.getState().success("Blok yangilandi!");
      } else {
        await BlockService.create({
          title,
          order: Number(order),
          courseId,
          category: "lesson",
        });
        useSnackbarStore.getState().success("Blok yaratildi!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      useSnackbarStore
        .getState()
        .error(err?.response?.data?.message ?? "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.875rem",
    borderRadius: "8px",
    height: 44,
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
  };
  const labelSx = {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 600,
    fontSize: "0.8125rem",
    mb: 0.75,
    color: "text.primary",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "95vw", sm: 440 },
          borderRadius: "8px",
          border: "1px solid",
          p: 0,
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#ffffff",
            borderColor: "#e2e8f0",
            boxShadow: "0 20px 40px rgba(15,23,42,0.12)",
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
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid",
            "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
            "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#e0f2fe",
                  color: "#0284c7",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(168,85,247,0.12)",
                  color: "#c084fc",
                },
              }}
            >
              <RiStackLine size={17} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Blokni tahrirlash" : "Yangi blok"}
            </Typography>
          </Box>
          <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl error={!!errors.title}>
            <FormLabel sx={labelSx}>Blok nomi</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: 1-modul"
              sx={inputSx}
            />
            {errors.title && (
              <FormHelperText
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                }}
              >
                {errors.title}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={!!errors.order}>
            <FormLabel sx={labelSx}>Tartib raqam</FormLabel>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="1"
              slotProps={{ input: { min: 1 } }}
              sx={inputSx}
            />
            {errors.order && (
              <FormHelperText
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                }}
              >
                {errors.order}
              </FormHelperText>
            )}
          </FormControl>
          <Divider
            sx={{
              "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
              "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
            }}
          />
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={onClose}
              disabled={loading}
              startDecorator={<RiCloseLine size={16} />}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={loading}
              startDecorator={
                loading ? (
                  <CircularProgress
                    size="sm"
                    sx={{ "--CircularProgress-size": "16px" }}
                  />
                ) : (
                  <RiSaveLine size={16} />
                )
              }
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                borderRadius: "8px",
                border: "none",
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
              {loading ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Yaratish"}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LessonsPage() {
  const params = useParams();
  const id = params.id as string;
  const courseId = Number(id);
  const queryClient = useQueryClient();
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [editBlock, setEditBlock] = useState<Block | null>(null);

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["lessonBlocks", courseId],
    queryFn: () => BlockService.getLessonBlocks(courseId),
    select: (res) =>
      Array.isArray(res.data)
        ? [...res.data].sort((a, b) => a.order - b.order)
        : [],
  });

  const refetch = () =>
    queryClient.invalidateQueries({ queryKey: ["lessonBlocks", courseId] });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
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
            Video darslar
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
              mt: 0.25,
            }}
          >
            {blocks?.length ?? 0} ta blok
          </Typography>
        </Box>
        <Button
          startDecorator={<RiAddLine size={18} />}
          onClick={() => {
            setEditBlock(null);
            setBlockModalOpen(true);
          }}
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.875rem",
            borderRadius: "8px",
            height: 40,
            border: "none",
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
          Yangi blok
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress
            sx={{
              "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
              "[data-joy-color-scheme='dark'] &": { color: "#9333ea" },
            }}
          />
        </Box>
      ) : !blocks?.length ? (
        <EmptyState
          title="Hali bloklar yo'q"
          description="Darslarni bloklar ichida tartiblab qo'ying"
          action={{
            label: "Blok yaratish",
            onClick: () => setBlockModalOpen(true),
          }}
        />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {blocks.map((block, index) => (
            <BlockAccordion
              key={block.id}
              block={block}
              courseId={courseId}
              defaultOpen={index === 0}
              onEdit={(b) => {
                setEditBlock(b);
                setBlockModalOpen(true);
              }}
            />
          ))}
        </Box>
      )}

      <BlockModal
        open={blockModalOpen}
        onClose={() => {
          setBlockModalOpen(false);
          setEditBlock(null);
        }}
        onSuccess={refetch}
        courseId={courseId}
        editData={editBlock}
      />
    </Box>
  );
}
