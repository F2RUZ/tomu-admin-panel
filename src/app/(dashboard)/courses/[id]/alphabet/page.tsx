// src/app/(dashboard)/courses/[id]/alphabet/page.tsx
"use client";

import { use } from "react";
import AlphabetList from "@/components/courses/sections/Alphabet/AlphabetList";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AlphabetPage({ params }: PageProps) {
  const { id } = use(params);
  return <AlphabetList courseId={Number(id)} />;
}
