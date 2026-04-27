"use client";

import { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  IconButton,
} from "@mui/joy";
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  error,
  disabled,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <FormControl error={!!error}>
      <FormLabel
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          fontSize: "0.8125rem",
          mb: 0.75,
          "[data-joy-color-scheme='light'] &": { color: "#374151" },
          "[data-joy-color-scheme='dark'] &": { color: "#d4d4d8" },
        }}
      >
        Parol
      </FormLabel>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        type={show ? "text" : "password"}
        disabled={disabled}
        startDecorator={<RiLockLine size={18} style={{ opacity: 0.5 }} />}
        endDecorator={
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            sx={{
              borderRadius: "8px",
              opacity: 0.5,
              "&:hover": { opacity: 1 },
            }}
          >
            {show ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
          </IconButton>
        }
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 500,
          fontSize: "0.9375rem",
          borderRadius: "12px",
          height: 52,
          transition: "all 0.2s ease",
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#f8fafc",
            border: "1.5px solid",
            borderColor: error ? "#ef4444" : "#e2e8f0",
            "&:hover": { borderColor: "#0284c7" },
            "&:focus-within": {
              borderColor: "#0284c7",
              boxShadow: "0 0 0 3px rgba(2,132,199,0.1)",
              bgcolor: "#fff",
            },
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "#26262d",
            border: "1.5px solid",
            borderColor: error ? "#ef4444" : "#3a3a44",
            "&:hover": { borderColor: "#9333ea" },
            "&:focus-within": {
              borderColor: "#9333ea",
              boxShadow: "0 0 0 3px rgba(147,51,234,0.12)",
              bgcolor: "#2a2a32",
            },
          },
        }}
      />
      {error && (
        <FormHelperText
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.75rem",
            color: "#ef4444",
            mt: 0.5,
          }}
        >
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
}
