// src/components/alphabet/AlphabetModal/index.tsx
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
  RiVideoLine,
  RiCloseLine,
  RiSaveLine,
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
  courses: { id: number; title: string }[];
}

interface FormErrors {
  title?: string;
  order?: string;
  courseId?: string;
  video?: string;
}

export default function AlphabetModal({
  open,
  onClose,
  onSuccess,
  editData,
  courses,
}: AlphabetModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [courseId, setCourseId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = !!editData;

  useEffect(() => {
    if (open) {
      if (editData) {
        setTitle(editData.title);
        setOrder(String(editData.order));
        setCourseId(String(editData.course?.id ?? ""));
      } else {
        setTitle("");
        setOrder("");
        setCourseId("");
        setVideoFile(null);
      }
      setErrors({});

      // Modal entrance animation
      setTimeout(() => {
        gsap.fromTo(
          dialogRef.current,
          { scale: 0.95, opacity: 0, y: 10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" },
        );
      }, 10);
    }
  }, [open, editData]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!order) errs.order = "Tartib raqam kiritilishi shart";
    else if (isNaN(Number(order)) || Number(order) < 1)
      errs.order = "Musbat son kiriting";
    if (!courseId) errs.courseId = "Kurs tanlanishi shart";
    if (!isEdit && !videoFile) errs.video = "Video fayl tanlanishi shart";
    return errs;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, video: "Faqat video fayl yuklang" }));
      return;
    }
    setVideoFile(file);
    setErrors((prev) => ({ ...prev, video: undefined }));
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
          courseId: Number(courseId),
          ...(videoFile && { video: videoFile }),
        };
        await AlphabetService.update(editData.id, dto);
        useSnackbarStore
          .getState()
          .success("Alphabet yangilandi!", "Muvaffaqiyat");
      } else {
        const dto: CreateAlphabetDto = {
          title,
          order: Number(order),
          courseId: Number(courseId),
          video: videoFile!,
        };
        await AlphabetService.create(dto);
        useSnackbarStore
          .getState()
          .success("Alphabet yaratildi!", "Muvaffaqiyat");
      }
      onSuccess();
      onClose();
    } catch {
      useSnackbarStore
        .getState()
        .error("Xatolik yuz berdi. Qayta urinib ko'ring");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        ref={dialogRef}
        sx={{
          width: { xs: "95vw", sm: 520 },
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "20px",
          border: "1px solid",
          p: 0,
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#ffffff",
            borderColor: "#e2e8f0",
            boxShadow: "0 24px 48px rgba(15,23,42,0.12)",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "#1c1c21",
            borderColor: "#3a3a44",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
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
                width: 36,
                height: 36,
                borderRadius: "10px",
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
              <RiVideoLine size={18} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Alphabetni tahrirlash" : "Yangi Alphabet"}
            </Typography>
          </Box>
          <ModalClose
            sx={{
              position: "static",
              borderRadius: "10px",
              "[data-joy-color-scheme='light'] &": {
                color: "#64748b",
                "&:hover": { bgcolor: "#f1f5f9" },
              },
              "[data-joy-color-scheme='dark'] &": {
                color: "#71717d",
                "&:hover": { bgcolor: "#26262d" },
              },
            }}
          />
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Title */}
          <FormControl error={!!errors.title}>
            <FormLabel
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "text.primary",
              }}
            >
              Sarlavha
            </FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Alif darsi"
              sx={{
                fontFamily: "var(--font-montserrat)",
                borderRadius: "10px",
                height: 44,
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#f8fafc",
                  borderColor: errors.title ? "#ef4444" : "#e2e8f0",
                  "& input": { color: "#0f172a" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#26262d",
                  borderColor: errors.title ? "#ef4444" : "#3a3a44",
                  "& input": { color: "#fafafa" },
                },
              }}
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

          {/* Order + CourseId */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {/* Order */}
            <FormControl error={!!errors.order}>
              <FormLabel
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "text.primary",
                }}
              >
                Tartib raqam
              </FormLabel>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
                slotProps={{ input: { min: 1 } }}
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  borderRadius: "10px",
                  height: 44,
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#f8fafc",
                    borderColor: errors.order ? "#ef4444" : "#e2e8f0",
                    "& input": { color: "#0f172a" },
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "#26262d",
                    borderColor: errors.order ? "#ef4444" : "#3a3a44",
                    "& input": { color: "#fafafa" },
                  },
                }}
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

            {/* Course */}
            <FormControl error={!!errors.courseId}>
              <FormLabel
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "text.primary",
                }}
              >
                Kurs
              </FormLabel>
              <Box
                component="select"
                value={courseId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCourseId(e.target.value)
                }
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  height: 44,
                  borderRadius: "10px",
                  border: "1px solid",
                  px: 1.5,
                  outline: "none",
                  cursor: "pointer",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#f8fafc",
                    borderColor: errors.courseId ? "#ef4444" : "#e2e8f0",
                    color: "#0f172a",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "#26262d",
                    borderColor: errors.courseId ? "#ef4444" : "#3a3a44",
                    color: "#fafafa",
                  },
                }}
              >
                <option value="">Kurs tanlang</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Box>
              {errors.courseId && (
                <FormHelperText
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "#ef4444",
                  }}
                >
                  {errors.courseId}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Video upload */}
          <FormControl error={!!errors.video}>
            <FormLabel
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "text.primary",
              }}
            >
              Video fayl {isEdit && "(ixtiyoriy)"}
            </FormLabel>
            <Box
              component="label"
              htmlFor="video-upload"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                p: 3,
                borderRadius: "12px",
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
                id="video-upload"
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
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
                <RiUploadCloud2Line size={20} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: videoFile ? "primary" : "text.secondary",
                  textAlign: "center",
                }}
              >
                {videoFile
                  ? videoFile.name
                  : "Video faylni bu yerga tashlang yoki bosing"}
              </Typography>
              {!videoFile && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  MP4, MOV, AVI formatlar qo'llab-quvvatlanadi
                </Typography>
              )}
            </Box>
            {errors.video && (
              <FormHelperText
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                }}
              >
                {errors.video}
              </FormHelperText>
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
                borderRadius: "10px",
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
                borderRadius: "10px",
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
