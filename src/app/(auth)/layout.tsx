import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROUTES } from "@/constants/routes";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    redirect(ROUTES.DASHBOARD);
  }

  return <>{children}</>;
}