"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, ArrowLeft, Loader2, X, ImageIcon } from "lucide-react";
import { Button, Card, CardContent, Alert, Skeleton } from "@/components/ui";
import { useUpdateDestination, getAdminDestinationError } from "@/hooks/use-admin-destinations";
import { destinationService } from "@/services";
import { DESTINATION_CATEGORIES, DESTINATION_SEASONS, CURRENCY_OPTIONS } from "@/types";
import type { Destination } from "@/types";

const destinationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  shortDescription: z.string().min(1, "Short description is required").max(500, "Short description cannot exceed 500 characters"),
  fullDescription: z.string().min(1, "Full description is required"),
  category: z.string().min(1, "Category is required"),
  averageDailyCost: z.coerce.number().min(0, "Average daily cost cannot be negative"),
  currency: z.string().min(1, "Currency is required").max(3, "Currency code cannot exceed 3 characters"),
  rating: z.coerce.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5"),
  bestSeason: z.string().min(1, "Best season is required"),
  recommendedDays: z.coerce.number().min(1, "Recommended days must be at least 1"),
  latitude: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  highlights: z.array(z.string().min(1, "Highlight cannot be empty")).min(1, "At least one highlight is required"),
  imageUrls: z.array(z.string().url("Must be a valid URL").or(z.literal(""))).optional(),
  status: z.enum(["draft", "published"]),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

export default function EditDestinationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const updateMutation = useUpdateDestination();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DestinationFormData>({
    /* eslint-disable @typescript-eslint/no-explicit-any */
    resolver: zodResolver(destinationSchema) as any,
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });

  const { fields: highlightFields, append: addHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: "highlights" as never,
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: "imageUrls" as never,
  });

  useEffect(() => {
    if (!id) return;
    destinationService.getAdminById(id)
      .then((dest) => {
        setDestination(dest);
        reset({
          title: dest.title,
          country: dest.country,
          city: dest.city,
          shortDescription: dest.shortDescription,
          fullDescription: dest.fullDescription,
          category: dest.category,
          averageDailyCost: dest.averageDailyCost,
          currency: dest.currency,
          rating: dest.rating,
          bestSeason: dest.bestSeason,
          recommendedDays: dest.recommendedDays,
          latitude: dest.latitude,
          longitude: dest.longitude,
          highlights: dest.highlights.length > 0 ? dest.highlights : [""],
          imageUrls: dest.images.length > 0 ? dest.images : [""],
          status: dest.status,
        });
      })
      .catch((err) => {
        setLoadError(getAdminDestinationError(err));
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = useCallback(
    async (data: DestinationFormData) => {
      try {
        await updateMutation.mutateAsync({
          id,
          data: {
            title: data.title,
            country: data.country,
            city: data.city,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            category: data.category,
            averageDailyCost: data.averageDailyCost,
            currency: data.currency,
            rating: data.rating,
            bestSeason: data.bestSeason,
            recommendedDays: data.recommendedDays,
            latitude: data.latitude,
            longitude: data.longitude,
            highlights: data.highlights.filter((h) => h.trim()),
            images: (data.imageUrls || []).filter((url) => url.trim()),
            status: data.status,
          },
        });
        setUpdated(true);
        setTimeout(() => router.push("/items/manage"), 1500);
      } catch {
        // Error handled by mutation
      }
    },
    [id, updateMutation, router]
  );

  const formError = updateMutation.error ? getAdminDestinationError(updateMutation.error) : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full rounded-[var(--radius-xl)]" />
        </div>
      </div>
    );
  }

  if (loadError || !destination) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Alert variant="error">{loadError || "Destination not found"}</Alert>
        <Link href="/items/manage" className="mt-4 inline-block">
          <Button variant="outline">Back to Manage</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/items/manage" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-500 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Manage
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Destination</h1>
        <p className="mt-2 text-slate-600">Update {destination.title}</p>
      </div>

      {updated && <Alert variant="success" className="mb-6">Updated successfully! Redirecting...</Alert>}
      {formError && <Alert variant="error" className="mb-6">{formError}</Alert>}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">Title *</label>
              <input id="title" type="text" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.title ? "border-red-500" : "border-slate-300"}`} {...register("title")} />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-slate-700">City *</label>
                <input id="city" type="text" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.city ? "border-red-500" : "border-slate-300"}`} {...register("city")} />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-slate-700">Country *</label>
                <input id="country" type="text" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.country ? "border-red-500" : "border-slate-300"}`} {...register("country")} />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="mb-1.5 block text-sm font-medium text-slate-700">Short Description *</label>
              <input id="shortDescription" type="text" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.shortDescription ? "border-red-500" : "border-slate-300"}`} {...register("shortDescription")} />
              {errors.shortDescription && <p className="mt-1 text-sm text-red-500">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label htmlFor="fullDescription" className="mb-1.5 block text-sm font-medium text-slate-700">Full Description *</label>
              <textarea id="fullDescription" rows={4} className={`flex w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.fullDescription ? "border-red-500" : "border-slate-300"}`} {...register("fullDescription")} />
              {errors.fullDescription && <p className="mt-1 text-sm text-red-500">{errors.fullDescription.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">Category *</label>
                <select id="category" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.category ? "border-red-500" : "border-slate-300"}`} {...register("category")}>
                  <option value="">Select</option>
                  {DESTINATION_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
              </div>
              <div>
                <label htmlFor="bestSeason" className="mb-1.5 block text-sm font-medium text-slate-700">Best Season *</label>
                <select id="bestSeason" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.bestSeason ? "border-red-500" : "border-slate-300"}`} {...register("bestSeason")}>
                  <option value="">Select</option>
                  {DESTINATION_SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.bestSeason && <p className="mt-1 text-sm text-red-500">{errors.bestSeason.message}</p>}
              </div>
              <div>
                <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">Status *</label>
                <select id="status" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.status ? "border-red-500" : "border-slate-300"}`} {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="averageDailyCost" className="mb-1.5 block text-sm font-medium text-slate-700">Daily Cost *</label>
                <input id="averageDailyCost" type="number" step="1" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.averageDailyCost ? "border-red-500" : "border-slate-300"}`} {...register("averageDailyCost")} />
                {errors.averageDailyCost && <p className="mt-1 text-sm text-red-500">{errors.averageDailyCost.message}</p>}
              </div>
              <div>
                <label htmlFor="currency" className="mb-1.5 block text-sm font-medium text-slate-700">Currency *</label>
                <select id="currency" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.currency ? "border-red-500" : "border-slate-300"}`} {...register("currency")}>
                  {CURRENCY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="rating" className="mb-1.5 block text-sm font-medium text-slate-700">Rating (0-5) *</label>
                <input id="rating" type="number" step="0.1" min="0" max="5" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.rating ? "border-red-500" : "border-slate-300"}`} {...register("rating")} />
              </div>
              <div>
                <label htmlFor="recommendedDays" className="mb-1.5 block text-sm font-medium text-slate-700">Days *</label>
                <input id="recommendedDays" type="number" min="1" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.recommendedDays ? "border-red-500" : "border-slate-300"}`} {...register("recommendedDays")} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="mb-1.5 block text-sm font-medium text-slate-700">Latitude *</label>
                <input id="latitude" type="number" step="any" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.latitude ? "border-red-500" : "border-slate-300"}`} {...register("latitude")} />
                {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude.message}</p>}
              </div>
              <div>
                <label htmlFor="longitude" className="mb-1.5 block text-sm font-medium text-slate-700">Longitude *</label>
                <input id="longitude" type="number" step="any" className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.longitude ? "border-red-500" : "border-slate-300"}`} {...register("longitude")} />
                {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Highlights *</label>
              {highlightFields.map((field, index) => (
                <div key={field.id} className="mb-2 flex items-center gap-2">
                  <input type="text" placeholder={`Highlight ${index + 1}`} className={`flex-1 h-10 rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.highlights?.[index] ? "border-red-500" : "border-slate-300"}`} {...register(`highlights.${index}`)} />
                  {highlightFields.length > 1 && (
                    <button type="button" onClick={() => removeHighlight(index)} className="shrink-0 rounded p-2 text-slate-400 hover:text-red-500 hover:bg-red-50"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={() => addHighlight("")} className="mt-1"><Plus className="mr-1 h-3.5 w-3.5" /> Add Highlight</Button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Image URLs</label>
              {imageFields.map((field, index) => (
                <div key={field.id} className="mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                  <input type="url" placeholder="https://example.com/image.jpg" className={`flex-1 h-10 rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${errors.imageUrls?.[index] ? "border-red-500" : "border-slate-300"}`} {...register(`imageUrls.${index}`)} />
                  <button type="button" onClick={() => removeImage(index)} className="shrink-0 rounded p-2 text-slate-400 hover:text-red-500 hover:bg-red-50"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={() => addImage("")} className="mt-1"><Plus className="mr-1 h-3.5 w-3.5" /> Add Image URL</Button>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
              <Link href="/items/manage"><Button variant="ghost" type="button">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
