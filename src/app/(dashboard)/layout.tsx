import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ROUTES } from "@/constants/routes";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect(ROUTES.LOGIN);
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
