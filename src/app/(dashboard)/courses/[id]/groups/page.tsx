"use client";
import { use } from "react";
import GroupTable from "@/components/courses/sections/Groups/GroupTable";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GroupsPage({ params }: PageProps) {
  const { id } = use(params);
  return <GroupTable courseId={Number(id)} />;
}
