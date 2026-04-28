// src/components/alphabet/AlphabetCard/index.tsx
"use client";

import { useRef, useEffect } from "react";
import { Box, Typography, IconButton, Chip, Tooltip } from "@mui/joy";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiPlayCircleLine,
  RiTimeLine,
  RiHashtag,
} from "react-icons/ri";
import { Alphabet } from "@/types/alphabet.types";
import { gsap } from "@/lib/gsap";

interface AlphabetCardProps {
  alphabet: Alphabet;
  index: number;
  onEdit: (alphabet: Alphabet) => void;
  onDelete: (alphabet: Alphabet) => void;
}

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};

export default function AlphabetCard({
  alphabet,
  index,
  onEdit,
  onDelete,
}: AlphabetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        delay: index * 0.06,
      },
    );
  }, [index]);

  return (
    <Box
      ref={cardRef}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          "[data-joy-color-scheme='light'] &": {
            boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
            borderColor: "#0284c7",
          },
          "[data-joy-color-scheme='dark'] &": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            borderColor: "#9333ea",
          },
        },
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "#ffffff",
          borderColor: "#e2e8f0",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "#1c1c21",
          borderColor: "#3a3a44",
        },
      }}
    >
      {/* Video preview */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16/9",
          overflow: "hidden",
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
        }}
      >
        {alphabet.videoUrl ? (
          <iframe
            src={alphabet.videoUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "none",
            }}
            allow="autoplay; fullscreen"
            title={alphabet.title}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.tertiary",
            }}
          >
            <RiPlayCircleLine size={48} />
          </Box>
        )}

        {/* Order badge */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 28,
            height: 28,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.75rem",
            "[data-joy-color-scheme='light'] &": {
              bgcolor: "#0284c7",
              color: "#fff",
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "#9333ea",
              color: "#fff",
            },
          }}
        >
          {alphabet.order}
        </Box>

        {/* Duration badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            px: 1,
            py: 0.25,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "rgba(0,0,0,0.6)",
          }}
        >
          <RiTimeLine size={12} color="#fff" />
          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {formatDuration(alphabet.duration)}
          </Typography>
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ p: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "text.primary",
            mb: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {alphabet.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.75rem",
              color: "text.tertiary",
            }}
          >
            {formatSize(alphabet.size)}
          </Typography>

          {alphabet.course && (
            <Chip
              size="sm"
              variant="soft"
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6875rem",
                fontWeight: 600,
                borderRadius: "6px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#e0f2fe",
                  color: "#0284c7",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(168,85,247,0.1)",
                  color: "#c084fc",
                },
              }}
            >
              {alphabet.course.title}
            </Chip>
          )}
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mt: 1.5,
            pt: 1.5,
            borderTop: "1px solid",
            "[data-joy-color-scheme='light'] &": { borderColor: "#f1f5f9" },
            "[data-joy-color-scheme='dark'] &": { borderColor: "#26262d" },
          }}
        >
          <Tooltip title="Tahrirlash" placement="top">
            <IconButton
              size="sm"
              variant="soft"
              onClick={() => onEdit(alphabet)}
              sx={{
                flex: 1,
                borderRadius: "8px",
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                fontWeight: 600,
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#e0f2fe",
                  color: "#0284c7",
                  "&:hover": { bgcolor: "#bae6fd" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(168,85,247,0.1)",
                  color: "#c084fc",
                  "&:hover": { bgcolor: "rgba(168,85,247,0.2)" },
                },
              }}
            >
              <RiEditLine size={16} />
            </IconButton>
          </Tooltip>

          <Tooltip title="O'chirish" placement="top">
            <IconButton
              size="sm"
              variant="soft"
              onClick={() => onDelete(alphabet)}
              sx={{
                flex: 1,
                borderRadius: "8px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#fff1f2",
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fecdd3" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(248,113,113,0.08)",
                  color: "#f87171",
                  "&:hover": { bgcolor: "rgba(248,113,113,0.15)" },
                },
              }}
            >
              <RiDeleteBinLine size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
