// src/components/courses/sections/Lessons/LessonModal/index.tsx
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
  RiCheckLine,
  RiLink,
} from "react-icons/ri";
import { Lesson, CreateLessonDto, UpdateLessonDto } from "@/types/lesson.types";
import LessonService from "@/services/lessonService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";
import { stopLenis, startLenis } from "@/lib/lenis";

interface LessonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Lesson | null;
  blockId: number;
}

interface FormErrors {
  title?: string;
  order?: string;
  video?: string;
}

// ─── Progress stages ──────────────────────────────────────────────────────────
type UploadStage =
  | "idle" // hech narsa yo'q
  | "uploading" // serverga yuklanmoqda (0–85%)
  | "processing" // server qayta ishlamoqda (85–99%)
  | "done"; // 100% tugadi

function getStageLabel(stage: UploadStage, percent: number): string {
  switch (stage) {
    case "uploading":
      return `Serverga yuklanmoqda... ${percent}%`;
    case "processing":
      return "Vimeo da qayta ishlanmoqda...";
    case "done":
      return "Yuklash tugadi ✓";
    default:
      return "";
  }
}

function getStageColor(stage: UploadStage): string {
  if (stage === "done") return "#22c55e";
  return "inherit";
}

export default function LessonModal({
  open,
  onClose,
  onSuccess,
  editData,
  blockId,
}: LessonModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [grammarLink, setGrammarLink] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = !!editData;

  // ── Reset on open ──────────────────────────────────────────────────────────

  // Lenis scroll lock
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (editData) {
      setTitle(editData.title ?? "");
      setOrder(String(editData.order ?? ""));
      setGrammarLink(editData.grammarLink ?? "");
      setVideoFile(null);
    } else {
      setTitle("");
      setOrder("");
      setGrammarLink("");
      setVideoFile(null);
    }
    setErrors({});
    setUploadPercent(0);
    setUploadStage("idle");

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

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!order) errs.order = "Tartib raqam kiritilishi shart";
    else if (isNaN(Number(order)) || Number(order) < 1)
      errs.order = "Musbat son kiriting";
    if (!isEdit && !videoFile) errs.video = "Video fayl tanlanishi shart";
    return errs;
  };

  // ── File change ────────────────────────────────────────────────────────────
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

  // ── Progress handler ───────────────────────────────────────────────────────
  const handleProgress = (percent: number) => {
    setUploadPercent(percent);
    if (percent < 85) {
      setUploadStage("uploading");
    } else if (percent < 100) {
      setUploadStage("processing");
    } else {
      setUploadStage("done");
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setUploadPercent(0);
    setUploadStage(videoFile ? "uploading" : "idle");

    try {
      if (isEdit && editData) {
        const dto: UpdateLessonDto = {
          title,
          order: Number(order),
          blockId,
          grammarLink: grammarLink || undefined,
          ...(videoFile && { video: videoFile }),
        };
        await LessonService.update(
          editData.id,
          dto,
          videoFile ? handleProgress : undefined,
        );
        useSnackbarStore.getState().success("Dars yangilandi!");
      } else {
        const dto: CreateLessonDto = {
          title,
          order: Number(order),
          blockId,
          video: videoFile!,
          grammarLink: grammarLink || undefined,
        };
        await LessonService.create(dto, handleProgress);
        useSnackbarStore
          .getState()
          .success("Dars yaratildi! Vimeo da tayyorlanmoqda...");
      }

      // ✅ Done — 100% ko'rsatamiz, keyin yopamiz
      setUploadPercent(100);
      setUploadStage("done");
      await new Promise((r) => setTimeout(r, 600)); // 0.6s done ko'rsatish

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      const msg = axiosErr?.response?.data?.message ?? "Xatolik yuz berdi";
      useSnackbarStore.getState().error(msg);
      setUploadStage("idle");
      setUploadPercent(0);
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
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

  const hasVideo = !!videoFile;
  const showProgress = loading && hasVideo && uploadStage !== "idle";

  return (
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <ModalDialog
        ref={dialogRef}
        sx={{
          width: { xs: "95vw", sm: 500 },
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: "12px",
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
        {/* ── Header ──────────────────────────────────────── */}
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
              {isEdit ? "Darsni tahrirlash" : "Yangi dars"}
            </Typography>
          </Box>
          {!loading && (
            <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
          )}
        </Box>

        {/* ── Progress bar ─────────────────────────────────── */}
        {showProgress && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#f8fafc",
                borderColor: "#e2e8f0",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "#26262d",
                borderColor: "#3a3a44",
              },
            }}
          >
            {/* Label row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.25,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: uploadStage === "done" ? "#22c55e" : "text.primary",
                  transition: "color 0.3s ease",
                }}
              >
                {getStageLabel(uploadStage, uploadPercent)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  minWidth: 36,
                  textAlign: "right",
                  "[data-joy-color-scheme='light'] &": {
                    color: uploadStage === "done" ? "#22c55e" : "#0284c7",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    color: uploadStage === "done" ? "#4ade80" : "#c084fc",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                {uploadPercent}%
              </Typography>
            </Box>

            {/* Progress track */}
            <Box
              sx={{
                position: "relative",
                height: 8,
                borderRadius: "99px",
                overflow: "hidden",
                "[data-joy-color-scheme='light'] &": { bgcolor: "#e2e8f0" },
                "[data-joy-color-scheme='dark'] &": { bgcolor: "#3a3a44" },
              }}
            >
              {/* Fill bar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: `${uploadPercent}%`,
                  borderRadius: "99px",
                  transition: "width 0.4s ease, background 0.3s ease",
                  background:
                    uploadStage === "done"
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : uploadStage === "processing"
                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        : "[data-joy-color-scheme='light'] ? linear-gradient(90deg, #0284c7, #38bdf8) : linear-gradient(90deg, #9333ea, #c084fc)",
                }}
              />
              {/* Processing shimmer */}
              {uploadStage === "processing" && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    "@keyframes shimmer": {
                      "0%": { left: "-100%" },
                      "100%": { left: "100%" },
                    },
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              )}
            </Box>

            {/* Stage info */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1.25,
              }}
            >
              {[
                {
                  label: "Yuklash",
                  done: uploadPercent >= 85,
                  active: uploadStage === "uploading",
                },
                {
                  label: "Vimeo",
                  done: uploadStage === "done",
                  active: uploadStage === "processing",
                },
                {
                  label: "Tayyor",
                  done: uploadStage === "done",
                  active: false,
                },
              ].map((step) => (
                <Box
                  key={step.label}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      transition: "background 0.3s ease",
                      bgcolor: step.done
                        ? "#22c55e"
                        : step.active
                          ? "#f59e0b"
                          : "text.tertiary",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      color: step.done
                        ? "#22c55e"
                        : step.active
                          ? "#f59e0b"
                          : "text.tertiary",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Form ─────────────────────────────────────────── */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Title */}
          <FormControl error={!!errors.title}>
            <FormLabel sx={labelSx}>Dars sarlavhasi</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: 1-dars kirish"
              disabled={loading}
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
              disabled={loading}
              slotProps={{ input: { min: 1 } }}
              sx={inputSx}
            />
            {errors.order && (
              <FormHelperText sx={errorSx}>{errors.order}</FormHelperText>
            )}
          </FormControl>

          {/* Grammar link */}
          <FormControl>
            <FormLabel sx={labelSx}>Grammar link (ixtiyoriy)</FormLabel>
            <Input
              value={grammarLink}
              onChange={(e) => setGrammarLink(e.target.value)}
              placeholder="https://player.vimeo.com/video/..."
              disabled={loading}
              startDecorator={<RiLink size={16} style={{ opacity: 0.5 }} />}
              sx={inputSx}
            />
          </FormControl>

          {/* Video */}
          <FormControl error={!!errors.video}>
            <FormLabel sx={labelSx}>
              Video fayl {isEdit && "(ixtiyoriy)"}
            </FormLabel>
            <Box
              component="label"
              htmlFor="lesson-video"
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
                      ? "#0284c7"
                      : "#e2e8f0",
                  bgcolor: videoFile ? "#f0f9ff" : "#f8fafc",
                  "&:hover": !loading
                    ? { borderColor: "#0284c7", bgcolor: "#f0f9ff" }
                    : {},
                },
                "[data-joy-color-scheme='dark'] &": {
                  borderColor: errors.video
                    ? "#ef4444"
                    : videoFile
                      ? "#9333ea"
                      : "#3a3a44",
                  bgcolor: videoFile ? "rgba(147,51,234,0.05)" : "#26262d",
                  "&:hover": !loading
                    ? {
                        borderColor: "#9333ea",
                        bgcolor: "rgba(147,51,234,0.05)",
                      }
                    : {},
                },
              }}
            >
              <input
                id="lesson-video"
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
                  transition: "all 0.2s ease",
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
                {videoFile ? (videoFile.name.length > 30 ? videoFile.name.slice(0, 30) + "..." : videoFile.name) : "Video faylni tanlang"}
              </Typography>
              {videoFile && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                </Typography>
              )}
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
                minWidth: 120,
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: uploadStage === "done" ? "#16a34a" : "#0284c7",
                  color: "#fff",
                  "&:hover:not(:disabled)": {
                    bgcolor: uploadStage === "done" ? "#15803d" : "#0369a1",
                  },
                  "&:disabled": { opacity: 0.75 },
                  transition: "background 0.3s ease",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: uploadStage === "done" ? "#16a34a" : "#9333ea",
                  color: "#fff",
                  "&:hover:not(:disabled)": {
                    bgcolor: uploadStage === "done" ? "#15803d" : "#7e22ce",
                  },
                  "&:disabled": { opacity: 0.75 },
                  transition: "background 0.3s ease",
                },
              }}
            >
              {loading
                ? uploadStage === "uploading"
                  ? `Yuklanmoqda ${uploadPercent}%`
                  : uploadStage === "processing"
                    ? "Vimeo..."
                    : uploadStage === "done"
                      ? "Tayyor ✓"
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
