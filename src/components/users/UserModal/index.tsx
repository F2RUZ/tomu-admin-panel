"use client";

import { useState, useEffect } from "react";
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
  RiUserLine,
  RiPhoneLine,
  RiLockLine,
  RiMenLine,
  RiWomenLine,
} from "react-icons/ri";
import { User, UpdateUserDto } from "@/types/user.types";
import { stopLenis, startLenis } from "@/lib/lenis";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import UserService from "@/services/userService";
import { useSnackbarStore } from "@/store/snackbarStore";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export default function UserModal({ open, onClose, onSuccess, user }: Props) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

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
    if (!open || !user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setGender((user.gender as "male" | "female") ?? "male");
    setPassword("");
    setShowPassword(false);
    setErrors({});
  }, [open, user]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Ism kiritilishi shart";
    if (!lastName.trim()) errs.lastName = "Familiya kiritilishi shart";
    if (!phoneNumber.trim()) errs.phoneNumber = "Telefon kiritilishi shart";
    if (password && password.length < 6) errs.password = "Kamida 6 ta belgi";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const dto: UpdateUserDto = {
        firstName,
        lastName,
        phoneNumber,
        gender,
        ...(password && { password }),
      };
      await UserService.update(user.id, dto);
      useSnackbarStore.getState().success("Foydalanuvchi yangilandi!");
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      useSnackbarStore
        .getState()
        .error(
          Array.isArray(msg) ? msg.join(", ") : (msg ?? "Xatolik yuz berdi"),
        );
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
  const errorSx = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.75rem",
    color: "#ef4444",
  };

  return (
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <ModalDialog
        sx={{
          width: { xs: "95vw", sm: 480 },
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            flexShrink: 0,
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
              <RiUserLine size={17} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "text.primary",
                }}
              >
                Foydalanuvchini tahrirlash
              </Typography>
              {user && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
              )}
            </Box>
          </Box>
          {!loading && (
            <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
          )}
        </Box>

        {/* Form — scrollable */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          data-lenis-prevent
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "[data-joy-color-scheme='light'] &::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "99px",
            },
            "[data-joy-color-scheme='dark'] &::-webkit-scrollbar-thumb": {
              background: "#3a3a44",
              borderRadius: "99px",
            },
          }}
        >
          {/* Ism + Familiya */}
          <FormControl error={!!errors.firstName}>
              <FormLabel sx={labelSx}>Ism</FormLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ali"
                disabled={loading}
                sx={inputSx}
              />
              {errors.firstName && (
                <FormHelperText sx={errorSx}>{errors.firstName}</FormHelperText>
              )}
          </FormControl>
          <FormControl error={!!errors.lastName}>
              <FormLabel sx={labelSx}>Familiya</FormLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Valiyev"
                disabled={loading}
                sx={inputSx}
              />
              {errors.lastName && (
                <FormHelperText sx={errorSx}>{errors.lastName}</FormHelperText>
              )}
          </FormControl>

          {/* Telefon */}
          <FormControl error={!!errors.phoneNumber}>
            <FormLabel sx={labelSx}>Telefon raqam</FormLabel>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+998901234567"
              disabled={loading}
              startDecorator={<RiPhoneLine size={16} />}
              sx={inputSx}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={errorSx}>{errors.phoneNumber}</FormHelperText>
            )}
          </FormControl>

          {/* Jins */}
          <FormControl>
            <FormLabel sx={labelSx}>Jins</FormLabel>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              {[
                {
                  value: "male",
                  label: "Erkak",
                  icon: <RiMenLine size={18} />,
                },
                {
                  value: "female",
                  label: "Ayol",
                  icon: <RiWomenLine size={18} />,
                },
              ].map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() =>
                    !loading && setGender(opt.value as "male" | "female")
                  }
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
                            borderColor: "#0284c7",
                            bgcolor: "#f0f9ff",
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            borderColor: "#9333ea",
                            bgcolor: "rgba(147,51,234,0.08)",
                          },
                        }
                      : {
                          "[data-joy-color-scheme='light'] &": {
                            borderColor: "#e2e8f0",
                            bgcolor: "#f8fafc",
                            "&:hover": { borderColor: "#0284c7" },
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            borderColor: "#3a3a44",
                            bgcolor: "#26262d",
                            "&:hover": { borderColor: "#9333ea" },
                          },
                        }),
                  }}
                >
                  <Box
                    sx={{
                      "[data-joy-color-scheme='light'] &": {
                        color: gender === opt.value ? "#0284c7" : "#64748b",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        color: gender === opt.value ? "#c084fc" : "#71717d",
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
                        color: gender === opt.value ? "#0284c7" : "#475569",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        color: gender === opt.value ? "#c084fc" : "#a1a1aa",
                      },
                    }}
                  >
                    {opt.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </FormControl>

          {/* Parol */}
          <FormControl error={!!errors.password}>
            <FormLabel sx={labelSx}>Yangi parol (ixtiyoriy)</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              disabled={loading}
              startDecorator={<RiLockLine size={16} />}
              sx={inputSx}
            />
            {errors.password && (
              <FormHelperText sx={errorSx}>{errors.password}</FormHelperText>
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
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                },
              }}
            >
              {loading ? "Saqlanmoqda..." : "Yangilash"}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
