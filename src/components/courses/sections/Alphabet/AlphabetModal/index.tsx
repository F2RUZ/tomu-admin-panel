// src/components/courses/sections/Alphabet/AlphabetModal/index.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  Typography,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  CircularProgress,
  Divider,
} from "@mui/joy";
import {
  RiUploadCloud2Line,
  RiSaveLine,
  RiCloseLine,
  RiVideoLine,
} from "react-icons/ri";
import {
  Alphabet,
  CreateAlphabetDto,
  UpdateAlphabetDto,
} from "@/types/alphabet.types";
import AlphabetService from "@/services/alphabetService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";

interface AlphabetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Alphabet | null;
  courseId: number;
}

interface FormErrors {
  title?: string;
  order?: string;
  video?: string;
}

export default function AlphabetModal({
  open,
  onClose,
  onSuccess,
  editData,
  courseId,
}: AlphabetModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = !!editData;

  useEffect(() => {
    if (!open) return;
    if (editData) {
      setTitle(editData.title ?? "");
      setOrder(String(editData.order ?? ""));
    } else {
      setTitle("");
      setOrder("");
      setVideoFile(null);
    }
    setErrors({});
    setTimeout(() => {
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { scale: 0.95, opacity: 0, y: 8 },
          { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: "back.out(1.2)" },
        );
      }
    }, 10);
  }, [open, editData]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!order) errs.order = "Tartib raqam kiritilishi shart";
    else if (isNaN(Number(order)) || Number(order) < 1)
      errs.order = "Musbat son kiriting";
    if (!isEdit && !videoFile) errs.video = "Video fayl tanlanishi shart";
    return errs;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setErrors((p) => ({ ...p, video: "Faqat video fayl yuklang" }));
      return;
    }
    setVideoFile(file);
    setErrors((p) => ({ ...p, video: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      if (isEdit && editData) {
        const dto: UpdateAlphabetDto = {
          title,
          order: Number(order),
          courseId,
          ...(videoFile && { video: videoFile }),
        };
        await AlphabetService.update(editData.id, dto);
        useSnackbarStore.getState().success("Alphabet yangilandi!");
      } else {
        const dto: CreateAlphabetDto = {
          title,
          order: Number(order),
          courseId,
          video: videoFile!,
        };
        await AlphabetService.create(dto);
        useSnackbarStore.getState().success("Alphabet yaratildi!");
      }
      onSuccess();
      onClose();
    } catch {
      useSnackbarStore.getState().error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 500,
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

  const errorSx = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.75rem",
    color: "#ef4444",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        ref={dialogRef}
        sx={{
          width: { xs: "95vw", sm: 480 },
          maxHeight: "90vh",
          overflowY: "auto",
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
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          },
        }}
      >
        {/* Header */}
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
              <RiVideoLine size={17} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Alphabetni tahrirlash" : "Yangi Alphabet"}
            </Typography>
          </Box>
          <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Title */}
          <FormControl error={!!errors.title}>
            <FormLabel sx={labelSx}>Sarlavha</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Alif darsi"
              sx={inputSx}
            />
            {errors.title && (
              <FormHelperText sx={errorSx}>{errors.title}</FormHelperText>
            )}
          </FormControl>

          {/* Order */}
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
              <FormHelperText sx={errorSx}>{errors.order}</FormHelperText>
            )}
          </FormControl>

          {/* Video upload */}
          <FormControl error={!!errors.video}>
            <FormLabel sx={labelSx}>
              Video fayl {isEdit && "(ixtiyoriy)"}
            </FormLabel>
            <Box
              component="label"
              htmlFor="alphabet-video"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                p: 3,
                borderRadius: "8px",
                border: "2px dashed",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "[data-joy-color-scheme='light'] &": {
                  borderColor: errors.video
                    ? "#ef4444"
                    : videoFile
                      ? "#0284c7"
                      : "#e2e8f0",
                  bgcolor: videoFile ? "#f0f9ff" : "#f8fafc",
                  "&:hover": { borderColor: "#0284c7", bgcolor: "#f0f9ff" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  borderColor: errors.video
                    ? "#ef4444"
                    : videoFile
                      ? "#9333ea"
                      : "#3a3a44",
                  bgcolor: videoFile ? "rgba(147,51,234,0.05)" : "#26262d",
                  "&:hover": {
                    borderColor: "#9333ea",
                    bgcolor: "rgba(147,51,234,0.05)",
                  },
                },
              }}
            >
              <input
                id="alphabet-video"
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: videoFile ? "#bae6fd" : "#e2e8f0",
                    color: videoFile ? "#0284c7" : "#64748b",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: videoFile ? "rgba(147,51,234,0.2)" : "#3a3a44",
                    color: videoFile ? "#c084fc" : "#71717d",
                  },
                }}
              >
                <RiUploadCloud2Line size={18} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: videoFile ? "text.primary" : "text.secondary",
                  textAlign: "center",
                }}
              >
                {videoFile ? videoFile.name : "Video faylni tanlang"}
              </Typography>
              {!videoFile && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  MP4, MOV, AVI
                </Typography>
              )}
            </Box>
            {errors.video && (
              <FormHelperText sx={errorSx}>{errors.video}</FormHelperText>
            )}
          </FormControl>

          <Divider
            sx={{
              "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
              "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
            }}
          />

          {/* Buttons */}
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
                  "&:disabled": { opacity: 0.6 },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                  "&:disabled": { opacity: 0.6 },
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
