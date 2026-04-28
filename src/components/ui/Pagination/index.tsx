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

  const btnSx = (disabled: boolean) => ({
    borderRadius: "8px",
    width: 32,
    height: 32,
    minWidth: 32,
    opacity: disabled ? 0.35 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
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

  const activeBtnSx = {
    borderRadius: "8px",
    width: 32,
    height: 32,
    minWidth: 32,
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "0.8125rem",
    border: "none",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: "#0284c7",
      color: "#fff",
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor: "#9333ea",
      color: "#fff",
    },
  };

  const inactiveBtnSx = {
    borderRadius: "8px",
    width: 32,
    height: 32,
    minWidth: 32,
    fontFamily: "var(--font-montserrat)",
    fontWeight: 500,
    fontSize: "0.8125rem",
    cursor: "pointer",
    border: "none",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: "#f1f5f9",
      color: "#475569",
      "&:hover": { bgcolor: "#e2e8f0" },
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor: "#26262d",
      color: "#a1a1aa",
      "&:hover": { bgcolor: "#3a3a44" },
    },
  };

  // Page raqamlari — max 5 ta
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
            color: "text.tertiary",
            whiteSpace: "nowrap",
          }}
        >
          {start}–{end} / {total} ta
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: "text.tertiary",
              whiteSpace: "nowrap",
            }}
          >
            Har sahifada:
          </Typography>
          <Select
            value={perPage}
            onChange={(_, v) => {
              if (v) {
                onPerPageChange(Number(v));
                onPageChange(1);
              }
            }}
            size="sm"
            sx={{
              minWidth: 70,
              borderRadius: "8px",
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#f8fafc",
                borderColor: "#e2e8f0",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "#26262d",
                borderColor: "#3a3a44",
              },
            }}
          >
            {perPageOptions.map((opt) => (
              <Option
                key={opt}
                value={opt}
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                }}
              >
                {opt}
              </Option>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Right: page buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* First */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          sx={btnSx(page === 1)}
        >
          <RiArrowLeftDoubleLine size={15} />
        </IconButton>

        {/* Prev */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          sx={btnSx(page === 1)}
        >
          <RiArrowLeftSLine size={15} />
        </IconButton>

        {/* Pages */}
        {getPages().map((p) => (
          <Box
            key={p}
            onClick={() => onPageChange(p)}
            sx={p === page ? activeBtnSx : inactiveBtnSx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          sx={btnSx(page === totalPages)}
        >
          <RiArrowRightSLine size={15} />
        </IconButton>

        {/* Last */}
        <IconButton
          size="sm"
          variant="soft"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          sx={btnSx(page === totalPages)}
        >
          <RiArrowRightDoubleLine size={15} />
        </IconButton>
      </Box>
    </Box>
  );
}
