// src/components/auth/LoginLayout/LoginLayoutInner.tsx
"use client";

import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { gsap } from "@/lib/gsap";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginLayoutInner() {
  const leftRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 },
    );
    gsap.to(orb1Ref.current, {
      y: -20,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    gsap.to(orb2Ref.current, {
      y: -15,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1,
    });
    gsap.fromTo(
      [stat1Ref.current, stat2Ref.current, stat3Ref.current],
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.15,
        delay: 0.5,
      },
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
      {/* ─── Left panel ─────────────────────────── */}
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
        <Box
          ref={orb1Ref}
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <Box
          ref={orb2Ref}
          sx={{
            position: "absolute",
            top: "60%",
            left: "60%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
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
            Online ta'lim
            <br />
            <Box component="span" sx={{ color: "rgba(255,255,255,0.65)" }}>
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
            Kurslar, guruhlar, o'quvchilar va to'lovlarni
            <br />
            bir joyda boshqaring.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {[
              { ref: stat1Ref, value: "10K+", label: "O'quvchilar" },
              { ref: stat2Ref, value: "50+", label: "Kurslar" },
              { ref: stat3Ref, value: "99%", label: "Ishonchlilik" },
            ].map((stat) => (
              <Box
                key={stat.label}
                ref={stat.ref}
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
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── Right panel ──────────────────────────────────── */}
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
        <Box
          sx={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}
        >
          <LoginCard />
        </Box>
      </Box>
    </Box>
  );
}
