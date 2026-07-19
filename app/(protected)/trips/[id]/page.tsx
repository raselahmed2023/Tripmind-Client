"use client";

import { useParams } from "next/navigation";
import { TripDetail } from "@/features/trips";

export default function TripDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <TripDetail tripId={id} />;
}
