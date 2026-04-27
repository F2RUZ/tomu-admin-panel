"use client";

import { useRef, useEffect } from "react";
import { Button, CircularProgress } from "@mui/joy";
import { RiArrowRightLine } from "react-icons/ri";
import { gsap } from "@/lib/gsap";

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
}

export default function SubmitButton({ loading, disabled }: SubmitButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      btnRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.3 },
    );
  }, []);

  // Loading pulse
  useEffect(() => {
    if (loading) {
      gsap.to(btnRef.current, {
        scale: 0.97,
        duration: 0.15,
        ease: "power2.out",
      });
    } else {
      gsap.to(btnRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(2)",
      });
    }
  }, [loading]);

  return (
    <Button
      ref={btnRef}
      type="submit"
      fullWidth
      disabled={disabled || loading}
      size="lg"
      endDecorator={
        loading ? (
          <CircularProgress
            size="sm"
            sx={{
              "--CircularProgress-size": "18px",
              "--CircularProgress-trackThickness": "2px",
              "[data-joy-color-scheme='light'] &": { color: "#fff" },
              "[data-joy-color-scheme='dark'] &": { color: "#fff" },
            }}
          />
        ) : (
          <RiArrowRightLine size={18} />
        )
      }
      sx={{
        height: 52,
        borderRadius: "12px",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700,
        fontSize: "0.9375rem",
        letterSpacing: "-0.01em",
        transition: "all 0.2s ease",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        "[data-joy-color-scheme='light'] &": {
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(2,132,199,0.35)",
          "&:hover:not(:disabled)": {
            background: "linear-gradient(135deg, #0369a1 0%, #075985 100%)",
            boxShadow: "0 6px 24px rgba(2,132,199,0.45)",
            transform: "translateY(-1px)",
          },
          "&:active:not(:disabled)": { transform: "translateY(0)" },
          "&:disabled": { opacity: 0.6, transform: "none" },
        },
        "[data-joy-color-scheme='dark'] &": {
          background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(147,51,234,0.4)",
          "&:hover:not(:disabled)": {
            background: "linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)",
            boxShadow: "0 6px 24px rgba(147,51,234,0.5)",
            transform: "translateY(-1px)",
          },
          "&:active:not(:disabled)": { transform: "translateY(0)" },
          "&:disabled": { opacity: 0.6, transform: "none" },
        },
      }}
    >
      {loading ? "Kirish..." : "Tizimga kirish"}
    </Button>
  );
}
