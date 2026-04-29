// src/components/courses/sections/Tariffs/TariffModal/index.tsx
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
  IconButton,
} from "@mui/joy";
import {
  RiSaveLine,
  RiCloseLine,
  RiPriceTagLine,
  RiAddLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { Tariff, CreateTariffDto, UpdateTariffDto } from "@/types/tariff.types";
import TariffService from "@/services/tariffService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";

interface TariffModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Tariff | null;
  courseId: number;
}

interface FormErrors {
  name?: string;
  duration?: string;
  price?: string;
}

export default function TariffModal({
  open,
  onClose,
  onSuccess,
  editData,
  courseId,
}: TariffModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = !!editData;

  useEffect(() => {
    if (!open) return;
    if (editData) {
      setName(editData.name ?? "");
      setDuration(String(editData.duration ?? ""));
      setPrice(String(editData.price ?? ""));
      setOptions(editData.options?.length ? editData.options : [""]);
    } else {
      setName("");
      setDuration("");
      setPrice("");
      setOptions([""]);
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
    if (!name.trim()) errs.name = "Tarif nomi kiritilishi shart";
    if (!duration || isNaN(Number(duration)) || Number(duration) < 1)
      errs.duration = "Musbat son kiriting (kunlarda)";
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      errs.price = "Narx kiritilishi shart";
    return errs;
  };

  const handleOptionChange = (i: number, val: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));
  };

  const addOption = () => setOptions((prev) => [...prev, ""]);
  const removeOption = (i: number) =>
    setOptions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const cleanOptions = options.filter((o) => o.trim() !== "");
    try {
      if (isEdit && editData) {
        const dto: UpdateTariffDto = {
          name,
          duration: Number(duration),
          price: Number(price),
          options: cleanOptions,
          courseId,
        };
        await TariffService.update(editData.id, dto);
        useSnackbarStore.getState().success("Tarif yangilandi!");
      } else {
        const dto: CreateTariffDto = {
          name,
          duration: Number(duration),
          price: Number(price),
          options: cleanOptions,
          courseId,
        };
        await TariffService.create(dto);
        useSnackbarStore.getState().success("Tarif yaratildi!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Xatolik yuz berdi";
      useSnackbarStore
        .getState()
        .error(Array.isArray(msg) ? msg.join(", ") : msg);
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
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <ModalDialog
        ref={dialogRef}
        sx={{
          width: { xs: "95vw", sm: 500 },
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
                  bgcolor: "#f3e8ff",
                  color: "#9333ea",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(147,51,234,0.12)",
                  color: "#c084fc",
                },
              }}
            >
              <RiPriceTagLine size={17} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Tarifni tahrirlash" : "Yangi tarif"}
            </Typography>
          </Box>
          {!loading && (
            <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
          )}
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Name */}
          <FormControl error={!!errors.name}>
            <FormLabel sx={labelSx}>Tarif nomi</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Basic, Standard, Premium"
              disabled={loading}
              sx={inputSx}
            />
            {errors.name && (
              <FormHelperText sx={errorSx}>{errors.name}</FormHelperText>
            )}
          </FormControl>

          {/* Duration + Price */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormControl error={!!errors.duration}>
              <FormLabel sx={labelSx}>Muddat (kun)</FormLabel>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                disabled={loading}
                slotProps={{ input: { min: 1 } }}
                sx={inputSx}
              />
              {errors.duration && (
                <FormHelperText sx={errorSx}>{errors.duration}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!errors.price}>
              <FormLabel sx={labelSx}>Narx (so'm)</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99000"
                disabled={loading}
                slotProps={{ input: { min: 0 } }}
                sx={inputSx}
              />
              {errors.price && (
                <FormHelperText sx={errorSx}>{errors.price}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Options */}
          <FormControl>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <FormLabel sx={{ ...labelSx, mb: 0 }}>
                Imkoniyatlar (ixtiyoriy)
              </FormLabel>
              <Button
                size="sm"
                variant="soft"
                startDecorator={<RiAddLine size={14} />}
                onClick={addOption}
                disabled={loading}
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderRadius: "8px",
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
                Qo'shish
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {options.map((opt, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1 }}>
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Imkoniyat ${i + 1}`}
                    disabled={loading}
                    sx={{ ...inputSx, flex: 1 }}
                  />
                  {options.length > 1 && (
                    <IconButton
                      size="sm"
                      variant="soft"
                      onClick={() => removeOption(i)}
                      disabled={loading}
                      sx={{
                        borderRadius: "8px",
                        flexShrink: 0,
                        "[data-joy-color-scheme='light'] &": {
                          bgcolor: "#fff1f2",
                          color: "#dc2626",
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          bgcolor: "rgba(248,113,113,0.08)",
                          color: "#f87171",
                        },
                      }}
                    >
                      <RiDeleteBinLine size={14} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
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
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                  "&:disabled": { opacity: 0.7 },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                  "&:disabled": { opacity: 0.7 },
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
