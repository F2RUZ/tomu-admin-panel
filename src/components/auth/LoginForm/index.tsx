"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Alert } from "@mui/joy";
import { RiErrorWarningLine } from "react-icons/ri";
import { useAuth } from "@/hooks/useAuth";
import { staggerChildren } from "@/lib/gsap";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
  const { login, loading, errors } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Stagger entrance
  useEffect(() => {
    staggerChildren(formRef.current, ".form-field");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ phoneNumber: phone, password });
  };

  return (
    <Box
      ref={formRef}
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* General error */}
      {errors.general && (
        <Alert
          className="form-field"
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

      {/* Phone */}
      <Box className="form-field">
        <PhoneInput
          value={phone}
          onChange={setPhone}
          error={errors.phoneNumber}
          disabled={loading}
        />
      </Box>

      {/* Password */}
      <Box className="form-field">
        <PasswordInput
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={loading}
        />
      </Box>

      {/* Submit */}
      <Box className="form-field" sx={{ mt: 0.5 }}>
        <SubmitButton loading={loading} />
      </Box>
    </Box>
  );
}
