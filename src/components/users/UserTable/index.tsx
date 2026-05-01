// src/components/users/UserTable/index.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Input,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  CircularProgress,
  Divider,
} from "@mui/joy";
import {
  RiSearchLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiMenLine,
  RiWomenLine,
  RiSaveLine,
  RiCloseLine,
  RiUserLine,
  RiLockLine,
  RiPhoneLine,
} from "react-icons/ri";
import { User, ROLE_CONFIG } from "@/types/user.types";
import UserService from "@/services/userService";
import { useSnackbarStore } from "@/store/snackbarStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import UserDetailModal from "@/components/users/UserDetailModal";
import api from "@/services/api";

// ─── Teacher Modal ─────────────────────────────────────────────────────────────
function TeacherModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [password, setPassword] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Kurslar ro'yxati
  const { data: coursesData } = useQuery({
    queryKey: ["courses-for-teacher"],
    queryFn: async () => {
      const res = await api.get("/course");
      return res.data?.data ?? [];
    },
    enabled: open,
  });
  const courses = Array.isArray(coursesData) ? coursesData : [];

  const reset = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setGender("male");
    setPassword("");
    setCourseId("");
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Ism kiritilishi shart";
    if (!lastName.trim()) errs.lastName = "Familiya kiritilishi shart";
    if (!phoneNumber.trim()) errs.phoneNumber = "Telefon kiritilishi shart";
    if (!courseId) errs.courseId = "Kurs tanlanishi shart";
    if (!password.trim()) errs.password = "Parol kiritilishi shart";
    else if (password.length < 6) errs.password = "Kamida 6 ta belgi";
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
      await api.post("/auth/register/teacher", {
        firstName,
        lastName,
        phoneNumber,
        gender,
        password,
        courseId: Number(courseId),
      });
      useSnackbarStore.getState().success("O'qituvchi yaratildi!");
      reset();
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
    <Modal
      open={open}
      onClose={
        loading
          ? undefined
          : () => {
              reset();
              onClose();
            }
      }
    >
      <ModalDialog
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
              <RiUserLine size={17} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              Yangi o'qituvchi
            </Typography>
          </Box>
          {!loading && (
            <ModalClose sx={{ position: "static", borderRadius: "8px" }} />
          )}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
          </Box>

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
                            borderColor: "#9333ea",
                            bgcolor: "#faf5ff",
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
                            "&:hover": { borderColor: "#9333ea" },
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
                        color: gender === opt.value ? "#9333ea" : "#64748b",
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
                        color: gender === opt.value ? "#9333ea" : "#475569",
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

          <FormControl error={!!errors.courseId}>
            <FormLabel sx={labelSx}>Kurs</FormLabel>
            <Box sx={{ position: "relative" }}>
              <Box
                component="select"
                value={courseId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCourseId(e.target.value)
                }
                disabled={loading}
                sx={{
                  width: "100%",
                  height: 44,
                  px: 2,
                  pr: 5,
                  borderRadius: "8px",
                  border: "1px solid",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
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
                <option value="">— Kurs tanlang —</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: "0.625rem",
                  "[data-joy-color-scheme='light'] &": { color: "#64748b" },
                  "[data-joy-color-scheme='dark'] &": { color: "#a1a1aa" },
                }}
              >
                ▼
              </Box>
            </Box>
            {errors.courseId && (
              <Box
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  mt: 0.5,
                }}
              >
                {errors.courseId}
              </Box>
            )}
          </FormControl>

          <FormControl error={!!errors.password}>
            <FormLabel sx={labelSx}>Parol</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi"
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

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                reset();
                onClose();
              }}
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
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#9333ea",
                  color: "#fff",
                  "&:hover": { bgcolor: "#7e22ce" },
                },
              }}
            >
              {loading ? "Yaratilmoqda..." : "Yaratish"}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  const s = {
    borderRadius: "6px",
    "@keyframes shimmer": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.35 },
      "100%": { opacity: 1 },
    },
    animation: "shimmer 1.4s ease-in-out infinite",
    "[data-joy-color-scheme='light'] &": { bgcolor: "#e2e8f0" },
    "[data-joy-color-scheme='dark'] &": { bgcolor: "#3a3a44" },
  };
  return (
    <tr>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 20, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ ...s, width: 36, height: 36, borderRadius: "8px" }} />
          <Box>
            <Box sx={{ ...s, width: 120, height: 14, mb: 0.75 }} />
            <Box sx={{ ...s, width: 80, height: 12 }} />
          </Box>
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 110, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 70, height: 22, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 24, height: 24, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 90, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
        </Box>
      </td>
    </tr>
  );
}

const ROLES = [
  { value: "", label: "Barcha rollar" },
  { value: "student", label: "Talabalar" },
  { value: "teacher", label: "O'qituvchilar" },
  { value: "admin", label: "Adminlar" },
  { value: "director", label: "Direktorlar" },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

export default function UserTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [viewTarget, setViewTarget] = useState<User | null>(null);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, perPage, search, role],
    queryFn: () => UserService.getAll({ page, limit: perPage, search, role }),
  });

  const users = data?.data?.users ?? [];
  const total = data?.data?.count ?? 0;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => UserService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Foydalanuvchi o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const handleSearch = useCallback((val: string) => {
    setSearchInput(val);
    const timer = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = [
    "#",
    "Foydalanuvchi",
    "Telefon",
    "Rol",
    "Jins",
    "Sana",
    "Amallar",
  ];
  const widths = ["48px", "auto", "140px", "120px", "70px", "110px", "90px"];

  return (
    <Box>
      <PageHeader
        title="Foydalanuvchilar"
        subtitle={`Jami ${total} ta foydalanuvchi`}
        action={{
          label: "O'qituvchi yaratish",
          onClick: () => setTeacherModalOpen(true),
        }}
      />

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <Input
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Ism yoki telefon..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            flex: 1,
            minWidth: 200,
            maxWidth: 320,
            borderRadius: "8px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
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
          }}
        />
        {/* Native select — dark mode muammosi yo'q */}
        <Box sx={{ position: "relative" }}>
          <Box
            component="select"
            value={role}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setRole(e.target.value);
              setPage(1);
            }}
            sx={{
              height: 44,
              px: 2,
              pr: 5,
              borderRadius: "8px",
              border: "1px solid",
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              fontWeight: 500,
              appearance: "none",
              cursor: "pointer",
              outline: "none",
              minWidth: 190,
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
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              fontSize: "0.625rem",
              "[data-joy-color-scheme='light'] &": { color: "#64748b" },
              "[data-joy-color-scheme='dark'] &": { color: "#a1a1aa" },
            }}
          >
            ▼
          </Box>
        </Box>
      </Box>

      {/* Table */}
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
        <Box sx={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}
          >
            <thead>
              <tr>
                {cols.map((col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      width: widths[i],
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        pb: 1.25,
                        borderBottom: "2px solid",
                        "[data-joy-color-scheme='light'] &": {
                          color: "#64748b",
                          borderColor: "#e2e8f0",
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          color: "#71717d",
                          borderColor: "#3a3a44",
                        },
                      }}
                    >
                      {col}
                    </Box>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title="Foydalanuvchilar topilmadi"
                      description="Boshqa kalit so'z bilan qidiring"
                    />
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => {
                  const roleConfig =
                    ROLE_CONFIG[user.role] ?? ROLE_CONFIG.student;
                  const isMale = user.gender === "male";
                  const avatarUrl = user.avatar
                    ? user.avatar.startsWith("http")
                      ? user.avatar
                      : `${BASE_URL}/${user.avatar}`
                    : null;

                  return (
                    <tr
                      key={user.id}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          document.documentElement.getAttribute(
                            "data-joy-color-scheme",
                          ) === "dark"
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.015)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            "[data-joy-color-scheme='light'] &": {
                              color: "#94a3b8",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              color: "#52525e",
                            },
                          }}
                        >
                          {(page - 1) * perPage + idx + 1}
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "8px",
                              flexShrink: 0,
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: "#f1f5f9",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "#26262d",
                              },
                            }}
                          >
                            {avatarUrl ? (
                              <Box
                                component="img"
                                src={avatarUrl}
                                alt={user.firstName}
                                onError={(
                                  e: React.SyntheticEvent<HTMLImageElement>,
                                ) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                  "[data-joy-color-scheme='light'] &": {
                                    color: "#64748b",
                                  },
                                  "[data-joy-color-scheme='dark'] &": {
                                    color: "#71717d",
                                  },
                                }}
                              >
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: "text.primary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                            {user.email && (
                              <Typography
                                sx={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontSize: "0.75rem",
                                  color: "text.tertiary",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {user.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </td>
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            color: "text.secondary",
                          }}
                        >
                          {user.phoneNumber || "—"}
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.25,
                            py: 0.375,
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
                              flexShrink: 0,
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
                      </td>
                      <td style={tdStyle}>
                        {user.gender ? (
                          <Tooltip
                            title={isMale ? "Erkak" : "Ayol"}
                            placement="top"
                            arrow
                          >
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "[data-joy-color-scheme='light'] &": {
                                  bgcolor: isMale ? "#e0f2fe" : "#fce7f3",
                                  color: isMale ? "#0284c7" : "#db2777",
                                },
                                "[data-joy-color-scheme='dark'] &": {
                                  bgcolor: isMale
                                    ? "rgba(2,132,199,0.1)"
                                    : "rgba(219,39,119,0.1)",
                                  color: isMale ? "#38bdf8" : "#f472b6",
                                },
                              }}
                            >
                              {isMale ? (
                                <RiMenLine size={14} />
                              ) : (
                                <RiWomenLine size={14} />
                              )}
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.875rem",
                              color: "text.tertiary",
                            }}
                          >
                            —
                          </Typography>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.8125rem",
                            color: "text.tertiary",
                          }}
                        >
                          {formatDate(user.createdAt)}
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Ko'rish" placement="top" arrow>
                            <IconButton
                              size="sm"
                              variant="soft"
                              onClick={() => setViewTarget(user)}
                              sx={{
                                borderRadius: "8px",
                                "[data-joy-color-scheme='light'] &": {
                                  bgcolor: "#e0f2fe",
                                  color: "#0284c7",
                                  "&:hover": { bgcolor: "#bae6fd" },
                                },
                                "[data-joy-color-scheme='dark'] &": {
                                  bgcolor: "rgba(2,132,199,0.1)",
                                  color: "#38bdf8",
                                  "&:hover": { bgcolor: "rgba(2,132,199,0.2)" },
                                },
                              }}
                            >
                              <RiEyeLine size={14} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="O'chirish" placement="top" arrow>
                            <IconButton
                              size="sm"
                              variant="soft"
                              onClick={() => setDeleteTarget(user)}
                              sx={{
                                borderRadius: "8px",
                                "[data-joy-color-scheme='light'] &": {
                                  bgcolor: "#fff1f2",
                                  color: "#dc2626",
                                  "&:hover": { bgcolor: "#fecdd3" },
                                },
                                "[data-joy-color-scheme='dark'] &": {
                                  bgcolor: "rgba(248,113,113,0.08)",
                                  color: "#f87171",
                                  "&:hover": {
                                    bgcolor: "rgba(248,113,113,0.15)",
                                  },
                                },
                              }}
                            >
                              <RiDeleteBinLine size={14} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Box>
      </Box>

      {!isLoading && total > 0 && (
        <Pagination
          total={total}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(pp) => {
            setPerPage(pp);
            setPage(1);
          }}
          perPageOptions={[10, 20, 50, 100]}
        />
      )}

      <TeacherModal
        open={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      />
      <UserDetailModal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        user={viewTarget}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Foydalanuvchini o'chirish"
        message={`"${deleteTarget?.firstName} ${deleteTarget?.lastName}" ni o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
