// src/components/ui/ConfirmModal/index.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  Modal,
  ModalDialog,
  CircularProgress,
} from "@mui/joy";
import { RiAlertLine, RiDeleteBinLine, RiCloseLine } from "react-icons/ri";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  open,
  title = "Tasdiqlang",
  message,
  loading = false,
  onConfirm,
  onClose,
  confirmLabel = "O'chirish",
  cancelLabel = "Bekor qilish",
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "90vw", sm: 400 },
          borderRadius: "20px",
          border: "1px solid",
          p: 3,
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#ffffff",
            borderColor: "#e2e8f0",
            boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "#1c1c21",
            borderColor: "#3a3a44",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: variant === "danger" ? "#fff1f2" : "#fffbeb",
                color: variant === "danger" ? "#dc2626" : "#d97706",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor:
                  variant === "danger"
                    ? "rgba(248,113,113,0.1)"
                    : "rgba(251,191,36,0.1)",
                color: variant === "danger" ? "#f87171" : "#fbbf24",
              },
            }}
          >
            <RiAlertLine size={28} />
          </Box>

          {/* Text */}
          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "text.primary",
                mb: 0.75,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
            <Button
              variant="plain"
              color="neutral"
              fullWidth
              onClick={onClose}
              disabled={loading}
              startDecorator={<RiCloseLine size={16} />}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                borderRadius: "10px",
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              fullWidth
              onClick={onConfirm}
              disabled={loading}
              startDecorator={
                loading ? (
                  <CircularProgress
                    size="sm"
                    sx={{ "--CircularProgress-size": "16px" }}
                  />
                ) : (
                  <RiDeleteBinLine size={16} />
                )
              }
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                borderRadius: "10px",
                border: "none",
                bgcolor: variant === "danger" ? "#dc2626" : "#d97706",
                color: "#fff",
                "&:hover": {
                  bgcolor: variant === "danger" ? "#b91c1c" : "#b45309",
                },
                "&:disabled": { opacity: 0.6 },
              }}
            >
              {loading ? "Amalga oshirilmoqda..." : confirmLabel}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
