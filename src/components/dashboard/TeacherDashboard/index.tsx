"use client";

import { Box, Typography, CircularProgress } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  RiUserLine,
  RiMessage3Line,
  RiBookOpenLine,
  RiTimeLine,
} from "react-icons/ri";
import LiveChatService from "@/services/liveChatService";
import api from "@/services/api";

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, { light: string; dark: string; bgLight: string; bgDark: string }> = {
    blue:   { light: "#0284c7", dark: "#38bdf8", bgLight: "#e0f2fe", bgDark: "rgba(2,132,199,0.1)" },
    purple: { light: "#9333ea", dark: "#c084fc", bgLight: "#f3e8ff", bgDark: "rgba(147,51,234,0.1)" },
    green:  { light: "#16a34a", dark: "#4ade80", bgLight: "#dcfce7", bgDark: "rgba(74,222,128,0.1)" },
    orange: { light: "#d97706", dark: "#fbbf24", bgLight: "#fef3c7", bgDark: "rgba(251,191,36,0.1)" },
  };
  const c = colors[color] ?? colors.blue;

  return (
    <Box sx={{
      p: 2.5, borderRadius: "12px", border: "1px solid",
      "[data-joy-color-scheme='light'] &": { bgcolor: "#fff", borderColor: "#e2e8f0" },
      "[data-joy-color-scheme='dark'] &": { bgcolor: "#1c1c21", borderColor: "#3a3a44" },
    }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          "[data-joy-color-scheme='light'] &": { bgcolor: c.bgLight, color: c.light },
          "[data-joy-color-scheme='dark'] &": { bgcolor: c.bgDark, color: c.dark },
        }}>
          {icon}
        </Box>
      </Box>
      <Typography sx={{
        fontFamily: "var(--font-montserrat)", fontWeight: 800,
        fontSize: "1.75rem", letterSpacing: "-0.03em", color: "text.primary",
      }}>
        {value}
      </Typography>
      <Typography sx={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "text.tertiary", mt: 0.25,
      }}>
        {title}
      </Typography>
    </Box>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuthStore();

  const { data: liveChats, isLoading: lcLoading } = useQuery({
    queryKey: ["teacherLiveChats", user?.id],
    queryFn: () => LiveChatService.getAll(),
    select: (res: any) => Array.isArray(res.data) ? res.data : [],
    enabled: !!user?.id,
  });

  const { data: students, isLoading: studLoading } = useQuery({
    queryKey: ["teacherStudents"],
    queryFn: () => api.get("/user", { params: { limit: 100, page: 1, role: "student" } }),
    select: (res: any) => res.data?.data?.count ?? 0,
  });

  const chats = liveChats ?? [];
  const pendingChats = chats.filter((c: any) => c.status === "paid" && !c.isAccepted);
  const acceptedChats = chats.filter((c: any) => c.isAccepted);
  const totalMinutes = acceptedChats.reduce((sum: number, c: any) => sum + (c.duration ?? 0), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", letterSpacing: "-0.03em", color: "text.primary" }}>
          Salom, {user?.firstName}! 👋
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "text.tertiary", mt: 0.25 }}>
          O'qituvchi paneli
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }, gap: 2 }}>
        <StatCard title="Jami talabalar" value={students ?? 0} icon={<RiUserLine size={22} />} color="blue" />
        <StatCard title="Jonli chat so'rovlari" value={chats.length} icon={<RiMessage3Line size={22} />} color="purple" />
        <StatCard title="Kutilayotgan so'rovlar" value={pendingChats.length} icon={<RiBookOpenLine size={22} />} color="orange" />
        <StatCard title="Jami dars (daqiqa)" value={totalMinutes} icon={<RiTimeLine size={22} />} color="green" />
      </Box>

      {/* Pending livechats */}
      <Box sx={{
        borderRadius: "12px", border: "1px solid", overflow: "hidden",
        "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0", bgcolor: "#fff" },
        "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44", bgcolor: "#1c1c21" },
      }}>
        <Box sx={{
          px: 2.5, py: 2, borderBottom: "1px solid",
          "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
          "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
        }}>
          <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "text.primary" }}>
            Kutilayotgan jonli chat so'rovlari
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          {lcLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size="sm" />
            </Box>
          ) : pendingChats.length === 0 ? (
            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "text.tertiary", textAlign: "center", py: 3 }}>
              Hozircha kutilayotgan so'rovlar yo'q
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {pendingChats.slice(0, 5).map((chat: any) => (
                <Box key={chat.id} sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  p: 1.5, borderRadius: "8px",
                  "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc" },
                  "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
                }}>
                  <Box>
                    <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }}>
                      {chat.firstName} {chat.lastName}
                    </Typography>
                    <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "text.tertiary" }}>
                      {chat.selectedDay} {chat.selectedTime} · {chat.duration} daqiqa
                    </Typography>
                  </Box>
                  <Box sx={{
                    px: 1.25, py: 0.375, borderRadius: "6px",
                    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.75rem",
                    "[data-joy-color-scheme='light'] &": { bgcolor: "#fef3c7", color: "#d97706" },
                    "[data-joy-color-scheme='dark'] &": { bgcolor: "rgba(251,191,36,0.1)", color: "#fbbf24" },
                  }}>
                    Kutilmoqda
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
