// src/components/ui/Pagination/index.tsx
"use client";

import { Box, Typography, IconButton, Select, Option } from "@mui/joy";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
} from "react-icons/ri";

interface PaginationProps {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
}

export default function Pagination({
  total,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  if (total === 0) return null;

  const navBtnSx = (disabled: boolean) => ({
    borderRadius: "8px",
    width: 32,
    height: 32,
    minWidth: 32,
    opacity: disabled ? 0.35 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: "#f1f5f9",
      color: "#475569",
      "&:hover": { bgcolor: disabled ? "#f1f5f9" : "#e2e8f0" },
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor: "#26262d",
      color: "#a1a1aa",
      "&:hover": { bgcolor: disabled ? "#26262d" : "#3a3a44" },
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        mt: 2,
        pt: 2,
        borderTop: "1px solid",
        "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
        "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
      }}
    >
      {/* Left: info + per page */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8125rem",
            "[data-joy-color-scheme='light'] &": { color: "#64748b" },
            "[data-joy-color-scheme='dark'] &": { color: "#71717d" },
            whiteSpace: "nowrap",
          }}
        >
          {start}–{end} / {total} ta
        </Typography>
      </Box>

      {/* Right: page buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* First */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          sx={navBtnSx(page === 1)}
        >
          <RiArrowLeftDoubleLine size={15} />
        </IconButton>

        {/* Prev */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          sx={navBtnSx(page === 1)}
        >
          <RiArrowLeftSLine size={15} />
        </IconButton>

        {/* Page numbers */}
        {getPages().map((p) => (
          <Box
            key={p}
            onClick={() => onPageChange(p)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              fontWeight: p === page ? 700 : 500,
              transition: "all 0.15s ease",
              userSelect: "none",
              ...(p === page
                ? {
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#0284c7",
                      color: "#ffffff",
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "#9333ea",
                      color: "#ffffff",
                    },
                  }
                : {
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#f1f5f9",
                      color: "#475569",
                      "&:hover": { bgcolor: "#e2e8f0" },
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "#26262d",
                      color: "#a1a1aa",
                      "&:hover": { bgcolor: "#3a3a44", color: "#fafafa" },
                    },
                  }),
            }}
          >
            {p}
          </Box>
        ))}

        {/* Next */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          sx={navBtnSx(page === totalPages)}
        >
          <RiArrowRightSLine size={15} />
        </IconButton>

        {/* Last */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          sx={navBtnSx(page === totalPages)}
        >
          <RiArrowRightDoubleLine size={15} />
        </IconButton>
      </Box>
    </Box>
  );
}
