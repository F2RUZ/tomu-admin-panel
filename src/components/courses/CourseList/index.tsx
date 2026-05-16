"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Input, IconButton, Tooltip } from "@mui/joy";
import { RiSearchLine, RiEditLine, RiDeleteBinLine, RiBookOpenLine, RiAddLine } from "react-icons/ri";
import { Course } from "@/types/course.types";
import CourseService from "@/services/courseService";
import { useSnackbarStore } from "@/store/snackbarStore";
import CourseModal from "@/components/courses/CourseModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/url";

function SkeletonRow() {
  const s = {
    borderRadius: "6px",
    "@keyframes shimmer": { "0%": { opacity: 1 }, "50%": { opacity: 0.35 }, "100%": { opacity: 1 } },
    animation: "shimmer 1.4s ease-in-out infinite",
    "[data-joy-color-scheme='light'] &": { bgcolor: "#e2e8f0" },
    "[data-joy-color-scheme='dark'] &": { bgcolor: "#3a3a44" },
  };
  return (
    <tr>
      <td style={{ padding: "14px 16px" }}><Box sx={{ ...s, width: 20, height: 14 }} /></td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ ...s, width: 48, height: 48, borderRadius: "8px" }} />
          <Box>
            <Box sx={{ ...s, width: 150, height: 14, mb: 0.75 }} />
            <Box sx={{ ...s, width: 200, height: 12 }} />
          </Box>
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}><Box sx={{ ...s, width: 60, height: 22, borderRadius: "6px" }} /></td>
      <td style={{ padding: "14px 16px" }}><Box sx={{ ...s, width: 80, height: 14 }} /></td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
        </Box>
      </td>
    </tr>
  );
}

export default function CourseList() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseService.getAll();
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch {
      useSnackbarStore.getState().error("Kurslarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  }, [search, courses]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await CourseService.delete(deleteTarget.id);
      useSnackbarStore.getState().success("Kurs o'chirildi");
      setDeleteTarget(null);
      await fetchData();
    } catch {
      useSnackbarStore.getState().error("O'chirishda xatolik");
    } finally {
      setDeleteLoading(false);
    }
  };

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = ["#", "Kurs", "Holat", "Sana", "Amallar"];
  const widths = ["48px", "auto", "120px", "120px", "100px"];

  return (
    <Box>
      <PageHeader
        title="Kurslar"
        subtitle={`Jami ${courses.length} ta kurs`}
        action={{ label: "Yangi kurs", onClick: () => { setEditData(null); setModalOpen(true); } }}
      />

      <Box sx={{ mb: 2 }}>
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Kurs qidirish..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 360, borderRadius: "8px",
            fontFamily: "var(--font-montserrat)", fontSize: "0.875rem",
            "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc", borderColor: "#e2e8f0", "& input": { color: "#0f172a" } },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d", borderColor: "#3a3a44", "& input": { color: "#fafafa" } },
          }}
        />
      </Box>

      <Box sx={{ borderRadius: "8px", border: "1px solid", overflow: "hidden", "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0", bgcolor: "#ffffff" }, "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44", bgcolor: "#1c1c21" } }}>
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                {cols.map((col, i) => (
                  <th key={col} style={{ padding: "10px 16px", textAlign: "left", width: widths[i] }}>
                    <Box sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.06em", textTransform: "uppercase", pb: 1.25, borderBottom: "2px solid", "[data-joy-color-scheme='light'] &": { color: "#64748b", borderColor: "#e2e8f0" }, "[data-joy-color-scheme='dark'] &": { color: "#71717d", borderColor: "#3a3a44" } }}>
                      {col}
                    </Box>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: perPage }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title={search ? "Hech narsa topilmadi" : "Hali kurs yo'q"}
                      description={search ? "Boshqa kalit so'z bilan qidiring" : "Birinchi kursni yarating"}
                      action={!search ? { label: "Kurs yaratish", onClick: () => setModalOpen(true) } : undefined}
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((course, idx) => {
                  const imgUrl = course.imageUrl ? getImageUrl(course.imageUrl) : null;
                  return (
                    <tr
                      key={course.id}
                      onClick={() => router.push(`/courses/${course.id}`)}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = document.documentElement.getAttribute("data-joy-color-scheme") === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td style={tdStyle}>
                        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", fontWeight: 500, "[data-joy-color-scheme='light'] &": { color: "#94a3b8" }, "[data-joy-color-scheme='dark'] &": { color: "#52525e" } }}>
                          {(page - 1) * perPage + idx + 1}
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 48, height: 48, borderRadius: "8px", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" }, "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" } }}>
                            {imgUrl ? (
                              <Box component="img" src={imgUrl} alt={course.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <Box sx={{ "[data-joy-color-scheme='light'] &": { color: "#94a3b8" }, "[data-joy-color-scheme='dark'] &": { color: "#52525e" } }}>
                                <RiBookOpenLine size={20} />
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {course.title}
                            </Typography>
                            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "text.tertiary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 400 }}>
                              {course.description}
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                      <td style={tdStyle}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.375, borderRadius: "6px", "[data-joy-color-scheme='light'] &": { bgcolor: course.isActive ? "#dcfce7" : "#f1f5f9" }, "[data-joy-color-scheme='dark'] &": { bgcolor: course.isActive ? "rgba(74,222,128,0.1)" : "#26262d" } }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", "[data-joy-color-scheme='light'] &": { bgcolor: course.isActive ? "#16a34a" : "#94a3b8" }, "[data-joy-color-scheme='dark'] &": { bgcolor: course.isActive ? "#4ade80" : "#52525e" } }} />
                          <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.75rem", "[data-joy-color-scheme='light'] &": { color: course.isActive ? "#16a34a" : "#64748b" }, "[data-joy-color-scheme='dark'] &": { color: course.isActive ? "#4ade80" : "#a1a1aa" } }}>
                            {course.isActive ? "Faol" : "Nofaol"}
                          </Typography>
                        </Box>
                      </td>
                      <td style={tdStyle}>
                        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "text.tertiary" }}>
                          {new Date(course.createdAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </Typography>
                      </td>
                      <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Tahrirlash" placement="top" arrow>
                            <IconButton size="sm" variant="soft" onClick={() => { setEditData(course); setModalOpen(true); }}
                              sx={{ borderRadius: "8px", "[data-joy-color-scheme='light'] &": { bgcolor: "#e0f2fe", color: "#0284c7", "&:hover": { bgcolor: "#bae6fd" } }, "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(2,132,199,0.1)", color: "#38bdf8", "&:hover": { bgcolor: "rgba(2,132,199,0.2)" } } }}>
                              <RiEditLine size={14} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="O'chirish" placement="top" arrow>
                            <IconButton size="sm" variant="soft" onClick={() => setDeleteTarget(course)}
                              sx={{ borderRadius: "8px", "[data-joy-color-scheme='light'] &": { bgcolor: "#fff1f2", color: "#dc2626", "&:hover": { bgcolor: "#fecdd3" } }, "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(248,113,113,0.08)", color: "#f87171", "&:hover": { bgcolor: "rgba(248,113,113,0.15)" } } }}>
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

      {!loading && filtered.length > 0 && (
        <Pagination
          total={filtered.length}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
          perPageOptions={[10, 20, 50]}
        />
      )}

      <CourseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSuccess={fetchData}
        editData={editData}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Kursni o'chirish"
        message={`"${deleteTarget?.title}" kursini o'chirasizmi?`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
