"use client";

import { FormControl, FormLabel, FormHelperText, Input } from "@mui/joy";
import { RiSmartphoneLine } from "react-icons/ri";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  if (digits.length === 0) return "";

  // +998 XX XXX XX XX
  let result = "";
  if (digits.length > 0) result = "+" + digits.slice(0, 3);
  if (digits.length > 3) result += " " + digits.slice(3, 5);
  if (digits.length > 5) result += " " + digits.slice(5, 8);
  if (digits.length > 8) result += " " + digits.slice(8, 10);
  if (digits.length > 10) result += " " + digits.slice(10, 12);
  return result;
};

export default function PhoneInput({
  value,
  onChange,
  error,
  disabled,
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Agar + bilan boshlasa yoki raqam bo'lsa
    const digits = raw.replace(/\D/g, "");
    // Avtomat 998 qo'shish
    const withPrefix = digits.startsWith("998")
      ? digits
      : digits.length > 0
        ? "998" + digits
        : "";
    onChange(formatPhone(withPrefix));
  };

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
        Telefon raqam
      </FormLabel>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="+998 90 123 45 67"
        disabled={disabled}
        type="tel"
        startDecorator={<RiSmartphoneLine size={18} style={{ opacity: 0.5 }} />}
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 500,
          fontSize: "0.9375rem",
          borderRadius: "12px",
          height: 52,
          letterSpacing: "0.02em",
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
