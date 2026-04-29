// src/components/users/UserDetailModal/index.tsx
"use client";

import {
  Box,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
} from "@mui/joy";
import {
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
  RiShieldLine,
  RiSmartphoneLine,
} from "react-icons/ri";
import { User, ROLE_CONFIG } from "@/types/user.types";

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "8px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "#f1f5f9",
          color: "#64748b",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "#26262d",
          color: "#a1a1aa",
        },
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          color: "text.tertiary",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "text.primary",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

export default function UserDetailModal({
  open,
  onClose,
  user,
}: UserDetailModalProps) {
  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.student;
  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${BASE_URL}/${user.avatar}`
    : null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "95vw", sm: 440 },
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
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "text.primary",
            }}
          >
            Foydalanuvchi ma'lumotlari
          </Typography>
          <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Avatar + Name + Role */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2.5,
              pb: 2.5,
              borderBottom: "1px solid",
              "[data-joy-color-scheme='light'] &": { borderColor: "#f1f5f9" },
              "[data-joy-color-scheme='dark'] &": { borderColor: "#26262d" },
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "8px",
                flexShrink: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
                "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
              }}
            >
              {avatarUrl ? (
                <Box
                  component="img"
                  src={avatarUrl}
                  alt={user.firstName}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    "[data-joy-color-scheme='light'] &": { color: "#64748b" },
                    "[data-joy-color-scheme='dark'] &": { color: "#71717d" },
                  }}
                >
                  {user.firstName[0]}
                  {user.lastName[0]}
                </Box>
              )}
            </Box>

            {/* Name + role */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  color: "text.primary",
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: "6px",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: roleConfig.light.bg,
                    color: roleConfig.light.color,
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: roleConfig.dark.bg,
                    color: roleConfig.dark.color,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "currentColor",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {roleConfig.label}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Info rows */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <InfoRow
              icon={<RiPhoneLine size={15} />}
              label="Telefon"
              value={user.phoneNumber}
            />
            <InfoRow
              icon={<RiMailLine size={15} />}
              label="Email"
              value={user.email}
            />
            <InfoRow
              icon={<RiShieldLine size={15} />}
              label="Jins"
              value={
                user.gender === "male"
                  ? "Erkak"
                  : user.gender === "female"
                    ? "Ayol"
                    : "—"
              }
            />
            <InfoRow
              icon={<RiSmartphoneLine size={15} />}
              label="Max qurilmalar"
              value={user.maxDevices}
            />
            <InfoRow
              icon={<RiCalendarLine size={15} />}
              label="Ro'yxatdan o'tgan"
              value={formatDate(user.createdAt)}
            />
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
