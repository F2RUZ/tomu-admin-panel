import type { Metadata } from "next";
import LoginLayout from "@/components/auth/LoginLayout";

export const metadata: Metadata = {
  title: "Kirish | TOMU Admin",
  description: "TOMU admin paneliga kirish",
};

export default function LoginPage() {
  return <LoginLayout />;
}
