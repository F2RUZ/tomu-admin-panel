// src/app/(dashboard)/courses/[id]/tariffs/page.tsx
"use client";

import { use } from "react";
import TariffTable from "@/components/courses/sections/Tariffs/TariffTable";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TariffsPage({ params }: PageProps) {
  const { id } = use(params);
  return <TariffTable courseId={Number(id)} />;
}
