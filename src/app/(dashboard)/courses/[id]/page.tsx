// src/app/(dashboard)/courses/[id]/alphabet/page.tsx
"use client";

import { use } from "react";
import AlphabetTable from "@/components/courses/sections/Alphabet/AlphabetTable";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AlphabetPage({ params }: PageProps) {
  const { id } = use(params);
  return <AlphabetTable courseId={Number(id)} />;
}
