"use client";

import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { gsap } from "@/lib/gsap";
import LoginCard from "@/components/auth/LoginCard";

// ─── Floating orb ─────────────────────────────────────────────────────────────
function Orb({
  size,
  top,
  left,
  delay,
  color,
}: {
  size: number;
  top: string;
  left: string;
  delay: number;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(ref.current, {
      y: -20,
      duration: 3 + delay,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay,
    });
  }, [delay]);

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${size * 0.4}px)`,
        opacity: 0.5,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Stats card ───────────────────────────────────────────────────────────────
function StatPill({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay }
    );
  }, [delay]);

  return (
    <Box
      ref={ref}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        bgcolor: "rgba(255,255,255,0.08)",
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "1.125rem",
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 500,
          fontSize: "0.8125rem",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function LoginLayout() {
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── Left panel (branding) — faqat desktop ─── */}
      <Box
        ref={leftRef}
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          px: { lg: 6, xl: 8 },
          py: 6,
          position: "relative",
          overflow: "hidden",

          "[data-joy-color-scheme='light'] &": {
            background:
              "linear-gradient(145deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)",
          },
          "[data-joy-color-scheme='dark'] &": {
            background:
              "linear-gradient(145deg, #1a0533 0%, #6b21a8 50%, #9333ea 100%)",
          },
        }}
      >
        {/* Floating orbs */}
        <Orb size={300} top="-10%" left="-10%" delay={0} color="rgba(255,255,255,0.06)" />
        <Orb size={200} top="60%" left="60%" delay={1} color="rgba(255,255,255,0.05)" />
        <Orb size={150} top="30%" left="70%" delay={0.5} color="rgba(255,255,255,0.04)" />

        {/* Grid pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          {/* Logo */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              mb: 5,
              px: 2,
              py: 1,
              borderRadius: "12px",
              bgcolor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.875rem",
                fontFamily: "var(--font-montserrat)",
                color: "#fff",
              }}
            >
              T
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "#fff",
              }}
            >
              TOMU Platform
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: { lg: "2.25rem", xl: "2.75rem" },
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            Online talim
            <br />
            <Box
              component="span"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              boshqaruv tizimi
            </Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "1rem",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.6,
              mb: 4,
              fontWeight: 400,
            }}
          >
            Kurslar, guruhlar, oquvchilar va tolovlarni
            <br />
            bir joyda boshqaring.
          </Typography>

          {/* Stats */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <StatPill value="10K+" label="O'quvchilar" delay={0.5} />
            <StatPill value="50+" label="Kurslar" delay={0.65} />
            <StatPill value="99%" label="Ishonchlilik" delay={0.8} />
          </Box>
        </Box>
      </Box>

      {/* ─── Right panel (form) ─── */}
      <Box
        sx={{
          width: { xs: "100%", lg: 520 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          py: 4,
          position: "relative",
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#0e0e12" },
        }}
      >
        {/* Background accent */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 300,
            height: 300,
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
            "[data-joy-color-scheme='light'] &": {
              bgcolor: "rgba(2,132,199,0.06)",
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "rgba(147,51,234,0.08)",
            },
          }}
        />

        <Box sx={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
          <LoginCard />
        </Box>
      </Box>
    </Box>
  );
}