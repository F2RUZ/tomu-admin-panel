"use client";
import { useParams } from "next/navigation";
import AlphabetTable from "@/components/courses/sections/Alphabet/AlphabetTable";

export default function AlphabetPage() {
  const params = useParams();
  const id = params.id as string;
  return <AlphabetTable courseId={Number(id)} />;
}
