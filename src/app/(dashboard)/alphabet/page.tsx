// src/app/(dashboard)/alphabet/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/joy";
import AlphabetTable from "@/components/alphabet/AlphabetTable";
import api from "@/services/api";

export default function AlphabetPage() {
  const [courses, setCourses] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    api
      .get("/course")
      .then((res) => {
        setCourses(res.data?.data ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      <AlphabetTable courses={courses} />
    </Box>
  );
}
