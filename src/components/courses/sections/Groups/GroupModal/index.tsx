// src/components/courses/sections/Groups/GroupModal/index.tsx
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
  RiSaveLine,
  RiCloseLine,
  RiGroupLine,
  RiMenLine,
  RiWomenLine,
} from "react-icons/ri";
import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GenderType, GenderInput,
} from "@/types/group.types";
import GroupService from "@/services/groupService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";

interface GroupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Group | null;
  courseId: number;
}

interface FormErrors {
  name?: string;
  maxStudents?: string;
}

export default function GroupModal({
  open,
  onClose,
  onSuccess,
  editData,
  courseId,
}: GroupModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<GenderInput>("MALE");
  const [maxStudents, setMaxStudents] = useState("12");
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = !!editData;

  useEffect(() => {
    if (!open) return;
    if (editData) {
      setName(editData.name ?? "");
      setGender(editData.gender?.toLowerCase() ?? "male");
      setMaxStudents(String(editData.maxStudents ?? 12));
    } else {
      setName("");
      setGender("male");
      setMaxStudents("12");
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
    if (!name.trim()) errs.name = "Guruh nomi kiritilishi shart";
    if (!maxStudents || isNaN(Number(maxStudents)) || Number(maxStudents) < 1)
      errs.maxStudents = "Musbat son kiriting";
    return errs;
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
        const dto: UpdateGroupDto = {
          name,
          gender,
          maxStudents: Number(maxStudents),
          courseId,
        };
        await GroupService.update(editData.id, dto);
        useSnackbarStore.getState().success("Guruh yangilandi!");
      } else {
        const dto: CreateGroupDto = {
          name,
          gender,
          maxStudents: Number(maxStudents),
          courseId,
        };
        await GroupService.create(dto);
        useSnackbarStore.getState().success("Guruh yaratildi!");
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
          width: { xs: "95vw", sm: 460 },
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
                  bgcolor: "#dcfce7",
                  color: "#16a34a",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(74,222,128,0.1)",
                  color: "#4ade80",
                },
              }}
            >
              <RiGroupLine size={17} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              {isEdit ? "Guruhni tahrirlash" : "Yangi guruh"}
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
            <FormLabel sx={labelSx}>Guruh nomi</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: 1a, 2b, Yangi guruh"
              disabled={loading}
              sx={inputSx}
            />
            {errors.name && (
              <FormHelperText sx={errorSx}>{errors.name}</FormHelperText>
            )}
          </FormControl>

          {/* Gender */}
          <FormControl>
            <FormLabel sx={labelSx}>Jins</FormLabel>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              {[
                {
                  value: "male",
                  label: "Erkaklar",
                  icon: <RiMenLine size={18} />,
                },
                {
                  value: "female",
                  label: "Ayollar",
                  icon: <RiWomenLine size={18} />,
                },
              ].map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => !loading && setGender(opt.value as GenderInput)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: "8px",
                    border: "2px solid",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    ...(gender === opt.value
                      ? {
                          "[data-joy-color-scheme='light'] &": {
                            borderColor: "#16a34a",
                            bgcolor: "#f0fdf4",
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            borderColor: "#4ade80",
                            bgcolor: "rgba(74,222,128,0.08)",
                          },
                        }
                      : {
                          "[data-joy-color-scheme='light'] &": {
                            borderColor: "#e2e8f0",
                            bgcolor: "#f8fafc",
                            "&:hover": { borderColor: "#16a34a" },
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            borderColor: "#3a3a44",
                            bgcolor: "#26262d",
                            "&:hover": { borderColor: "#4ade80" },
                          },
                        }),
                  }}
                >
                  <Box
                    sx={{
                      "[data-joy-color-scheme='light'] &": {
                        color: gender === opt.value ? "#16a34a" : "#64748b",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        color: gender === opt.value ? "#4ade80" : "#71717d",
                      },
                    }}
                  >
                    {opt.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      "[data-joy-color-scheme='light'] &": {
                        color: gender === opt.value ? "#16a34a" : "#475569",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        color: gender === opt.value ? "#4ade80" : "#a1a1aa",
                      },
                    }}
                  >
                    {opt.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </FormControl>

          {/* Max students */}
          <FormControl error={!!errors.maxStudents}>
            <FormLabel sx={labelSx}>Maksimal talabalar soni</FormLabel>
            <Input
              type="number"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
              placeholder="12"
              disabled={loading}
              slotProps={{ input: { min: 1, max: 100 } }}
              sx={inputSx}
            />
            {errors.maxStudents && (
              <FormHelperText sx={errorSx}>{errors.maxStudents}</FormHelperText>
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
                  bgcolor: "#16a34a",
                  color: "#fff",
                  "&:hover": { bgcolor: "#15803d" },
                  "&:disabled": { opacity: 0.7 },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#16a34a",
                  color: "#fff",
                  "&:hover": { bgcolor: "#15803d" },
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
