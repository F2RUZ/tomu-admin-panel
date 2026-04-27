// src/components/auth/LoginForm/index.tsx
"use client";

import { useState } from "react";
import { Box, Alert } from "@mui/joy";
import { RiErrorWarningLine } from "react-icons/ri";
import { useAuth } from "@/hooks/useAuth";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
  const { login, loading, errors } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ phoneNumber: phone, password });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {errors.general && (
        <Alert
          color="danger"
          variant="soft"
          startDecorator={<RiErrorWarningLine size={18} />}
          sx={{
            borderRadius: "12px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8125rem",
            fontWeight: 500,
          }}
        >
          {errors.general}
        </Alert>
      )}

      <PhoneInput
        value={phone}
        onChange={setPhone}
        error={errors.phoneNumber}
        disabled={loading}
      />

      <PasswordInput
        value={password}
        onChange={setPassword}
        error={errors.password}
        disabled={loading}
      />

      <Box sx={{ mt: 0.5 }}>
        <SubmitButton loading={loading} />
      </Box>
    </Box>
  );
}
