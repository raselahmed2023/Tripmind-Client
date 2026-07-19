import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { destinationService } from "@/services";
import { DestinationDetailContent } from "@/features/destination-detail";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const destination = await destinationService.getBySlug(slug);

    return {
      title: `${destination.title} | TripMind`,
      description:
        destination.shortDescription ||
        `Explore ${destination.title} in ${destination.city}, ${destination.country}. Plan your trip with AI-powered recommendations.`,
      openGraph: {
        title: `${destination.title} | TripMind`,
        description: destination.shortDescription || "",
        images:
          destination.images && destination.images.length > 0
            ? [{ url: destination.images[0], width: 1200, height: 630 }]
            : [],
      },
    };
  } catch {
    return {
      title: "Destination Not Found | TripMind",
      description: "The destination you're looking for could not be found.",
    };
  }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;

  try {
    await destinationService.getBySlug(slug);
  } catch {
    notFound();
  }

  return <DestinationDetailContent slug={slug} />;
}
