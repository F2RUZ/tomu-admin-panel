// src/components/courses/CourseModal/index.tsx
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
  Textarea,
  Switch,
  CircularProgress,
  Divider,
} from "@mui/joy";
import {
  RiUploadCloud2Line,
  RiSaveLine,
  RiCloseLine,
  RiBookOpenLine,
} from "react-icons/ri";
import {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  LANG_OPTIONS,
} from "@/types/course.types";
import CourseService from "@/services/courseService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Course | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

export default function CourseModal({
  open,
  onClose,
  onSuccess,
  editData,
}: CourseModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [lang, setLang] = useState("ar");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = !!editData;

  useEffect(() => {
    if (!open) return;

    if (editData) {
      setTitle(editData.title ?? "");
      setDescription(editData.description ?? "");
      setVideoUrl(editData.videoUrl ?? "");
      setLang(editData.lang ?? "ar");
      setIsActive(editData.isActive ?? true);
      setImageFile(null);

      if (editData.imageUrl) {
        const imgUrl = editData.imageUrl.startsWith("http")
          ? editData.imageUrl
          : `${BASE_URL}/${editData.imageUrl}`;
        setImagePreview(imgUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setLang("ar");
      setIsActive(true);
      setImageFile(null);
      setImagePreview(null);
    }

    setErrors({});

    setTimeout(() => {
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { scale: 0.95, opacity: 0, y: 10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" },
        );
      }
    }, 10);
  }, [open, editData]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!description.trim()) errs.description = "Tavsif kiritilishi shart";
    if (!isEdit && !imageFile) errs.image = "Rasm tanlanishi shart";
    return errs;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Faqat rasm fayl yuklang" }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, image: undefined }));
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
        const dto: UpdateCourseDto = {
          title,
          description,
          videoUrl,
          lang,
          isActive,
          ...(imageFile && { image: imageFile }),
        };
        await CourseService.update(editData.id, dto);
        useSnackbarStore.getState().success("Kurs yangilandi!");
      } else {
        const dto: CreateCourseDto = {
          title,
          description,
          videoUrl,
          ...(imageFile && { image: imageFile }),
        };
        await CourseService.create(dto);
        useSnackbarStore.getState().success("Kurs yaratildi!");
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
    fontSize: "0.9rem",
    borderRadius: "10px",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: "#f8fafc",
      borderColor: "#e2e8f0",
      "& input": { color: "#0f172a" },
      "& textarea": { color: "#0f172a" },
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor: "#26262d",
      borderColor: "#3a3a44",
      "& input": { color: "#fafafa" },
      "& textarea": { color: "#fafafa" },
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
        ref={dialogRef}
        sx={{
          width: { xs: "95vw", sm: 560 },
          maxHeight: "92vh",
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
              <RiBookOpenLine size={18} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Kursni tahrirlash" : "Yangi kurs"}
            </Typography>
          </Box>
          <ModalClose sx={{ position: "static", borderRadius: "10px" }} />
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Image */}
          <FormControl error={!!errors.image}>
            <FormLabel sx={labelSx}>
              Kurs rasmi {isEdit && "(ixtiyoriy)"}
            </FormLabel>
            <Box
              component="label"
              htmlFor="course-image"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                borderRadius: "12px",
                border: "2px dashed",
                cursor: "pointer",
                overflow: "hidden",
                height: imagePreview ? 180 : 120,
                transition: "all 0.2s ease",
                "[data-joy-color-scheme='light'] &": {
                  borderColor: errors.image
                    ? "#ef4444"
                    : imageFile
                      ? "#0284c7"
                      : "#e2e8f0",
                  bgcolor: imagePreview ? "transparent" : "#f8fafc",
                  "&:hover": { borderColor: "#0284c7" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  borderColor: errors.image
                    ? "#ef4444"
                    : imageFile
                      ? "#9333ea"
                      : "#3a3a44",
                  bgcolor: imagePreview ? "transparent" : "#26262d",
                  "&:hover": { borderColor: "#9333ea" },
                },
              }}
            >
              <input
                id="course-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="preview"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "[data-joy-color-scheme='light'] &": {
                        bgcolor: "#e2e8f0",
                        color: "#64748b",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        bgcolor: "#3a3a44",
                        color: "#71717d",
                      },
                    }}
                  >
                    <RiUploadCloud2Line size={20} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Rasm tanlash
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      color: "text.tertiary",
                    }}
                  >
                    JPG, PNG, WEBP
                  </Typography>
                </>
              )}
            </Box>
            {errors.image && (
              <FormHelperText
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                }}
              >
                {errors.image}
              </FormHelperText>
            )}
          </FormControl>

          {/* Title */}
          <FormControl error={!!errors.title}>
            <FormLabel sx={labelSx}>Kurs nomi</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Arab tili kursi"
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

          {/* Description */}
          <FormControl error={!!errors.description}>
            <FormLabel sx={labelSx}>Tavsif</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurs haqida qisqacha ma'lumot..."
              minRows={3}
              maxRows={5}
              sx={{ ...inputSx }}
            />
            {errors.description && (
              <FormHelperText
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                }}
              >
                {errors.description}
              </FormHelperText>
            )}
          </FormControl>

          {/* Video URL */}
          <FormControl>
            <FormLabel sx={labelSx}>Video URL (ixtiyoriy)</FormLabel>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://vimeo.com/..."
              sx={inputSx}
            />
          </FormControl>

          {/* Lang — faqat edit da */}
          {isEdit && (
            <FormControl>
              <FormLabel sx={labelSx}>Til</FormLabel>
              <Box
                component="select"
                value={lang}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setLang(e.target.value)
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
                    borderColor: "#e2e8f0",
                    color: "#0f172a",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "#26262d",
                    borderColor: "#3a3a44",
                    color: "#fafafa",
                  },
                }}
              >
                {LANG_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </Box>
            </FormControl>
          )}

          {/* isActive — faqat edit da */}
          {isEdit && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "10px",
                "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc" },
                "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "text.primary",
                  }}
                >
                  Kurs holati
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  {isActive
                    ? "Faol — o'quvchilar ko'ra oladi"
                    : "Nofaol — yashirin"}
                </Typography>
              </Box>
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                sx={{
                  "[data-joy-color-scheme='light'] &": {
                    "--Switch-trackBackground": isActive
                      ? "#0284c7"
                      : "#cbd5e1",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    "--Switch-trackBackground": isActive
                      ? "#9333ea"
                      : "#3a3a44",
                  },
                }}
              />
            </Box>
          )}

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
