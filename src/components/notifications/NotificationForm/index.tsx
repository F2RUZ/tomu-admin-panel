// src/components/notifications/NotificationForm/index.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Input,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  CircularProgress,
  Divider,
} from "@mui/joy";
import {
  RiNotification3Line,
  RiSendPlaneLine,
  RiUserLine,
  RiGroupLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import NotificationService from "@/services/notificationService";
import { useSnackbarStore } from "@/store/snackbarStore";

// ─── Result card ─────────────────────────────────────────────────────────────
function ResultCard({
  success,
  failure,
  onClose,
}: {
  success: number;
  failure: number;
  onClose: () => void;
}) {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        p: 2.5,
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "#f0fdf4",
          borderColor: "#bbf7d0",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "rgba(74,222,128,0.05)",
          borderColor: "rgba(74,222,128,0.2)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <RiCheckboxCircleLine size={22} color="#16a34a" />
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#16a34a",
          }}
        >
          Bildirishnoma yuborildi!
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#16a34a",
            }}
          >
            {success}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: "text.tertiary",
            }}
          >
            Muvaffaqiyatli
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: failure > 0 ? "#dc2626" : "#94a3b8",
            }}
          >
            {failure}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: "text.tertiary",
            }}
          >
            Muvaffaqiyatsiz
          </Typography>
        </Box>
      </Box>
      <Button
        size="sm"
        variant="plain"
        color="neutral"
        onClick={onClose}
        sx={{
          mt: 1.5,
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          borderRadius: "8px",
        }}
      >
        Yopish
      </Button>
    </Box>
  );
}

export default function NotificationForm() {
  // Send to all
  const [allTitle, setAllTitle] = useState("");
  const [allBody, setAllBody] = useState("");
  const [allLoading, setAllLoading] = useState(false);
  const [allErrors, setAllErrors] = useState<{ title?: string; body?: string }>(
    {},
  );
  const [allResult, setAllResult] = useState<{
    success: number;
    failure: number;
  } | null>(null);

  // Send to user
  const [userTitle, setUserTitle] = useState("");
  const [userBody, setUserBody] = useState("");
  const [userId, setUserId] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [userErrors, setUserErrors] = useState<{
    title?: string;
    body?: string;
    userId?: string;
  }>({});
  const [userResult, setUserResult] = useState<{
    success: number;
    failure: number;
  } | null>(null);

  // Status
  const { data: status } = useQuery({
    queryKey: ["notification-status"],
    queryFn: NotificationService.getStatus,
    retry: false,
  });

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

  const textareaSx = {
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

  // ── Send to all ──────────────────────────────────────────────────────────────
  const handleSendAll = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof allErrors = {};
    if (!allTitle.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!allBody.trim()) errs.body = "Xabar matni kiritilishi shart";
    if (Object.keys(errs).length > 0) {
      setAllErrors(errs);
      return;
    }
    setAllLoading(true);
    try {
      const res = await NotificationService.sendToAll({
        title: allTitle,
        body: allBody,
      });
      setAllResult({ success: res.success, failure: res.failure });
      setAllTitle("");
      setAllBody("");
      setAllErrors({});
      useSnackbarStore
        .getState()
        .success(`${res.success} ta qurilmaga yuborildi!`);
    } catch {
      useSnackbarStore.getState().error("Bildirishnoma yuborishda xatolik");
    } finally {
      setAllLoading(false);
    }
  };

  // ── Send to user ─────────────────────────────────────────────────────────────
  const handleSendUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof userErrors = {};
    if (!userTitle.trim()) errs.title = "Sarlavha kiritilishi shart";
    if (!userBody.trim()) errs.body = "Xabar matni kiritilishi shart";
    if (!userId || isNaN(Number(userId)) || Number(userId) < 1)
      errs.userId = "To'g'ri User ID kiriting";
    if (Object.keys(errs).length > 0) {
      setUserErrors(errs);
      return;
    }
    setUserLoading(true);
    try {
      const res = await NotificationService.sendToUser({
        title: userTitle,
        body: userBody,
        userId: Number(userId),
      });
      setUserResult({ success: res.success, failure: res.failure });
      setUserTitle("");
      setUserBody("");
      setUserId("");
      setUserErrors({});
      useSnackbarStore.getState().success("Foydalanuvchiga yuborildi!");
    } catch {
      useSnackbarStore.getState().error("Bildirishnoma yuborishda xatolik");
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1.375rem",
            letterSpacing: "-0.03em",
            color: "text.primary",
          }}
        >
          Bildirishnomalar
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: status?.status === "active" ? "#16a34a" : "#94a3b8",
            }}
          />
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
            }}
          >
            {status?.status === "active"
              ? "Firebase servis faol"
              : "Servis holati noma'lum"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* ── Barcha userlarga ──────────────────────────────────────────── */}
        <Box
          sx={{
            borderRadius: "8px",
            border: "1px solid",
            overflow: "hidden",
            "[data-joy-color-scheme='light'] &": {
              borderColor: "#e2e8f0",
              bgcolor: "#ffffff",
            },
            "[data-joy-color-scheme='dark'] &": {
              borderColor: "#3a3a44",
              bgcolor: "#1c1c21",
            },
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: "1px solid",
              "[data-joy-color-scheme='light'] &": {
                borderColor: "#e2e8f0",
                bgcolor: "#f8fafc",
              },
              "[data-joy-color-scheme='dark'] &": {
                borderColor: "#3a3a44",
                bgcolor: "#26262d",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#e0f2fe",
                    color: "#0284c7",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "rgba(2,132,199,0.12)",
                    color: "#38bdf8",
                  },
                }}
              >
                <RiGroupLine size={18} />
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
                  Barcha userlarga
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  Barcha qurilmalarga push notification
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSendAll}
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {allResult ? (
              <ResultCard
                success={allResult.success}
                failure={allResult.failure}
                onClose={() => setAllResult(null)}
              />
            ) : (
              <>
                <FormControl error={!!allErrors.title}>
                  <FormLabel sx={labelSx}>Sarlavha</FormLabel>
                  <Input
                    value={allTitle}
                    onChange={(e) => setAllTitle(e.target.value)}
                    placeholder="Masalan: Yangi dars mavjud!"
                    disabled={allLoading}
                    sx={inputSx}
                  />
                  {allErrors.title && (
                    <FormHelperText sx={errorSx}>
                      {allErrors.title}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl error={!!allErrors.body}>
                  <FormLabel sx={labelSx}>Xabar matni</FormLabel>
                  <Textarea
                    value={allBody}
                    onChange={(e) => setAllBody(e.target.value)}
                    placeholder="Xabar mazmunini yozing..."
                    minRows={3}
                    maxRows={5}
                    disabled={allLoading}
                    sx={textareaSx}
                  />
                  {allErrors.body && (
                    <FormHelperText sx={errorSx}>
                      {allErrors.body}
                    </FormHelperText>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  disabled={allLoading}
                  startDecorator={
                    allLoading ? (
                      <CircularProgress
                        size="sm"
                        sx={{ "--CircularProgress-size": "16px" }}
                      />
                    ) : (
                      <RiSendPlaneLine size={16} />
                    )
                  }
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    borderRadius: "8px",
                    border: "none",
                    alignSelf: "flex-end",
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#0284c7",
                      color: "#fff",
                      "&:hover": { bgcolor: "#0369a1" },
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "#0284c7",
                      color: "#fff",
                      "&:hover": { bgcolor: "#0369a1" },
                    },
                  }}
                >
                  {allLoading ? "Yuborilmoqda..." : "Hammaga yuborish"}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* ── Bitta userga ─────────────────────────────────────────────── */}
        <Box
          sx={{
            borderRadius: "8px",
            border: "1px solid",
            overflow: "hidden",
            "[data-joy-color-scheme='light'] &": {
              borderColor: "#e2e8f0",
              bgcolor: "#ffffff",
            },
            "[data-joy-color-scheme='dark'] &": {
              borderColor: "#3a3a44",
              bgcolor: "#1c1c21",
            },
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: "1px solid",
              "[data-joy-color-scheme='light'] &": {
                borderColor: "#e2e8f0",
                bgcolor: "#f8fafc",
              },
              "[data-joy-color-scheme='dark'] &": {
                borderColor: "#3a3a44",
                bgcolor: "#26262d",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
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
                <RiUserLine size={18} />
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
                  Bitta userga
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  Muayyan foydalanuvchiga yuborish
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSendUser}
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {userResult ? (
              <ResultCard
                success={userResult.success}
                failure={userResult.failure}
                onClose={() => setUserResult(null)}
              />
            ) : (
              <>
                <FormControl error={!!userErrors.userId}>
                  <FormLabel sx={labelSx}>User ID</FormLabel>
                  <Input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Masalan: 42"
                    disabled={userLoading}
                    slotProps={{ input: { min: 1 } }}
                    sx={inputSx}
                  />
                  {userErrors.userId && (
                    <FormHelperText sx={errorSx}>
                      {userErrors.userId}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl error={!!userErrors.title}>
                  <FormLabel sx={labelSx}>Sarlavha</FormLabel>
                  <Input
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    placeholder="Masalan: Sizga yangi vazifa!"
                    disabled={userLoading}
                    sx={inputSx}
                  />
                  {userErrors.title && (
                    <FormHelperText sx={errorSx}>
                      {userErrors.title}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl error={!!userErrors.body}>
                  <FormLabel sx={labelSx}>Xabar matni</FormLabel>
                  <Textarea
                    value={userBody}
                    onChange={(e) => setUserBody(e.target.value)}
                    placeholder="Xabar mazmunini yozing..."
                    minRows={3}
                    maxRows={5}
                    disabled={userLoading}
                    sx={textareaSx}
                  />
                  {userErrors.body && (
                    <FormHelperText sx={errorSx}>
                      {userErrors.body}
                    </FormHelperText>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  disabled={userLoading}
                  startDecorator={
                    userLoading ? (
                      <CircularProgress
                        size="sm"
                        sx={{ "--CircularProgress-size": "16px" }}
                      />
                    ) : (
                      <RiSendPlaneLine size={16} />
                    )
                  }
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    borderRadius: "8px",
                    border: "none",
                    alignSelf: "flex-end",
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#9333ea",
                      color: "#fff",
                      "&:hover": { bgcolor: "#7e22ce" },
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "#9333ea",
                      color: "#fff",
                      "&:hover": { bgcolor: "#7e22ce" },
                    },
                  }}
                >
                  {userLoading ? "Yuborilmoqda..." : "Userga yuborish"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Info */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: "8px",
          border: "1px solid",
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#fef3c7",
            borderColor: "#fde68a",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "rgba(251,191,36,0.05)",
            borderColor: "rgba(251,191,36,0.2)",
          },
        }}
      >
        <Box sx={{ color: "#d97706", flexShrink: 0, mt: 0.25 }}>
          <RiErrorWarningLine size={18} />
        </Box>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8125rem",
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          Bildirishnomalar faqat mobil ilovada FCM token ro'yxatdan o'tkazgan
          foydalanuvchilarga yetib boradi. Token ro'yxatdan o'tmagan qurilmalar
          "Muvaffaqiyatsiz" sifatida hisoblanadi.
        </Typography>
      </Box>
    </Box>
  );
}
