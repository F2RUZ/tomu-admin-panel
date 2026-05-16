"use client";
import { useParams } from "next/navigation";
import TariffTable from "@/components/courses/sections/Tariffs/TariffTable";

export default function TariffsPage() {
  const params = useParams();
  const id = params.id as string;
  return <TariffTable courseId={Number(id)} />;
}
