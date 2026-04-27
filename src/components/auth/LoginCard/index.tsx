"use client";

import { useRef, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/joy";
import { gsap } from "@/lib/gsap";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 32, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" },
    );
  }, []);

  return (
    <Box
      ref={cardRef}
      sx={{
        width: "100%",
        maxWidth: 440,
        borderRadius: "24px",
        p: { xs: 3, sm: 4 },
        border: "1px solid",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",

        // Light
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "rgba(255,255,255,0.9)",
          borderColor: "rgba(226,232,240,0.8)",
          boxShadow:
            "0 32px 64px rgba(15,23,42,0.08), 0 8px 24px rgba(15,23,42,0.04)",
        },
        // Dark
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "rgba(28,28,33,0.85)",
          borderColor: "rgba(58,58,68,0.6)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Top glow */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 120,
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "rgba(2,132,199,0.12)",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "rgba(147,51,234,0.2)",
          },
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.125rem",
              fontFamily: "var(--font-montserrat)",
              flexShrink: 0,
              "[data-joy-color-scheme='light'] &": {
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(2,132,199,0.3)",
              },
              "[data-joy-color-scheme='dark'] &": {
                background: "linear-gradient(135deg, #9333ea, #7e22ce)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(147,51,234,0.4)",
              },
            }}
          >
            T
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "1.25rem",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "text.primary",
              }}
            >
              TOMU Admin
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                color: "text.tertiary",
                fontWeight: 500,
              }}
            >
              Boshqaruv paneli
            </Typography>
          </Box>
        </Box>

        {/* Heading */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "-0.03em",
              color: "text.primary",
              lineHeight: 1.2,
              mb: 0.75,
            }}
          >
            Xush kelibsiz 👋
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.secondary",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Davom etish uchun tizimga kiring
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, opacity: 0.5 }} />

        {/* Form */}
        <LoginForm />

        {/* Footer */}
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.75rem",
            color: "text.tertiary",
            textAlign: "center",
            mt: 3,
            lineHeight: 1.6,
          }}
        >
          Faqat admin va direktor hisoblar kirishi mumkin
        </Typography>
      </Box>
    </Box>
  );
}
