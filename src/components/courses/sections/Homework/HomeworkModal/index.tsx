// src/components/courses/sections/Homework/HomeworkModal/index.tsx
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
  LinearProgress,
  Textarea,
} from "@mui/joy";
import {
  RiUploadCloud2Line,
  RiSaveLine,
  RiCloseLine,
  RiHomeLine,
  RiCheckLine,
} from "react-icons/ri";
import {
  Homework,
  CreateHomeworkDto,
  UpdateHomeworkDto,
} from "@/types/homework.types";
import HomeworkService from "@/services/homeworkService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";

interface HomeworkModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Homework | null;
  blockId: number;
}

interface FormErrors {
  title?: string;
  order?: string;
  video?: string;
}

export default function HomeworkModal({
  open,
  onClose,
  onSuccess,
  editData,
  blockId,
}: HomeworkModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      setVideoFile(null);
    } else {
      setTitle("");
      setOrder("");
      setVideoFile(null);
    }
    setErrors({});
    setUploadProgress(0);
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
    if (!title.trim()) errs.title = "Tavsif kiritilishi shart";
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
    setUploadProgress(0);
    try {
      if (isEdit && editData) {
        const dto: UpdateHomeworkDto = {
          title,
          order: Number(order),
          blockId,
          ...(videoFile && { video: videoFile }),
        };
        await HomeworkService.update(editData.id, dto, setUploadProgress);
        useSnackbarStore.getState().success("Uy vazifasi yangilandi!");
      } else {
        const dto: CreateHomeworkDto = {
          title,
          order: Number(order),
          blockId,
          video: videoFile!,
        };
        await HomeworkService.create(dto, setUploadProgress);
        useSnackbarStore
          .getState()
          .success("Uy vazifasi yaratildi! Vimeo da tayyorlanmoqda...");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Xatolik yuz berdi";
      useSnackbarStore.getState().error(msg);
    } finally {
      setLoading(false);
      setUploadProgress(0);
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
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <ModalDialog
        ref={dialogRef}
        sx={{
          width: { xs: "95vw", sm: 480 },
          maxHeight: "92vh",
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
                  bgcolor: "#fef3c7",
                  color: "#d97706",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(251,191,36,0.1)",
                  color: "#fbbf24",
                },
              }}
            >
              <RiHomeLine size={17} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Uy vazifasini tahrirlash" : "Yangi uy vazifasi"}
            </Typography>
          </Box>
          {!loading && (
            <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
          )}
        </Box>

        {/* Progress */}
        {loading && uploadProgress > 0 && (
          <Box sx={{ px: 3, pt: 2.5 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {uploadProgress < 100
                  ? "Video yuklanmoqda..."
                  : "Vimeoga yuborildi ✓"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  "[data-joy-color-scheme='light'] &": { color: "#d97706" },
                  "[data-joy-color-scheme='dark'] &": { color: "#fbbf24" },
                }}
              >
                {uploadProgress}%
              </Typography>
            </Box>
            <LinearProgress
              determinate
              value={uploadProgress}
              sx={{
                borderRadius: "99px",
                height: 6,
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#fef3c7",
                  "& .MuiLinearProgress-bar": { bgcolor: "#d97706" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#26262d",
                  "& .MuiLinearProgress-bar": { bgcolor: "#f59e0b" },
                },
              }}
            />
            {uploadProgress === 100 && (
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "text.tertiary",
                  mt: 0.75,
                }}
              >
                Vimeo da qayta ishlanmoqda...
              </Typography>
            )}
          </Box>
        )}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Description */}
          <FormControl error={!!errors.title}>
            <FormLabel sx={labelSx}>Tavsif / Ko'rsatma</FormLabel>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Uy vazifasi haqida ko'rsatma yozing..."
              minRows={3}
              maxRows={5}
              disabled={loading}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                borderRadius: "8px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  "& textarea": { color: "#0f172a" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#26262d",
                  borderColor: "#3a3a44",
                  "& textarea": { color: "#fafafa" },
                },
              }}
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
              disabled={loading}
              slotProps={{ input: { min: 1 } }}
              sx={inputSx}
            />
            {errors.order && (
              <FormHelperText sx={errorSx}>{errors.order}</FormHelperText>
            )}
          </FormControl>

          {/* Video */}
          <FormControl error={!!errors.video}>
            <FormLabel sx={labelSx}>
              Video fayl {isEdit && "(ixtiyoriy)"}
            </FormLabel>
            <Box
              component="label"
              htmlFor="homework-video"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                p: 3,
                borderRadius: "8px",
                border: "2px dashed",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                "[data-joy-color-scheme='light'] &": {
                  borderColor: errors.video
                    ? "#ef4444"
                    : videoFile
                      ? "#d97706"
                      : "#e2e8f0",
                  bgcolor: videoFile ? "#fffbeb" : "#f8fafc",
                  "&:hover": !loading
                    ? { borderColor: "#d97706", bgcolor: "#fffbeb" }
                    : {},
                },
                "[data-joy-color-scheme='dark'] &": {
                  borderColor: errors.video
                    ? "#ef4444"
                    : videoFile
                      ? "#f59e0b"
                      : "#3a3a44",
                  bgcolor: videoFile ? "rgba(245,158,11,0.05)" : "#26262d",
                  "&:hover": !loading
                    ? {
                        borderColor: "#f59e0b",
                        bgcolor: "rgba(245,158,11,0.05)",
                      }
                    : {},
                },
              }}
            >
              <input
                id="homework-video"
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={loading}
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
                    bgcolor: videoFile ? "#fde68a" : "#e2e8f0",
                    color: videoFile ? "#d97706" : "#64748b",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: videoFile ? "rgba(245,158,11,0.2)" : "#3a3a44",
                    color: videoFile ? "#fbbf24" : "#71717d",
                  },
                }}
              >
                {videoFile ? (
                  <RiCheckLine size={18} />
                ) : (
                  <RiUploadCloud2Line size={18} />
                )}
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
              {videoFile ? (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                </Typography>
              ) : (
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
                  bgcolor: "#d97706",
                  color: "#fff",
                  "&:hover": { bgcolor: "#b45309" },
                  "&:disabled": { opacity: 0.7 },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#f59e0b",
                  color: "#000",
                  "&:hover": { bgcolor: "#d97706" },
                  "&:disabled": { opacity: 0.7 },
                },
              }}
            >
              {loading
                ? uploadProgress > 0
                  ? `${uploadProgress}%`
                  : "Tayyorlanmoqda..."
                : isEdit
                  ? "Yangilash"
                  : "Yaratish"}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
