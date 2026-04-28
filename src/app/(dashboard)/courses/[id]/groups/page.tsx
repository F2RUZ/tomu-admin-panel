// src/app/(dashboard)/courses/[id]/groups/page.tsx
"use client";
import { use } from "react";
import { Box, Typography } from "@mui/joy";
interface PageProps {
  params: Promise<{ id: string }>;
}
export default function GroupsPage({ params }: PageProps) {
  const { id } = use(params);
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "1.25rem",
          color: "text.primary",
        }}
      >
        Guruhlar
      </Typography>
    </Box>
  );
}
