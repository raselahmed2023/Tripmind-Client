"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Button, Card, CardContent, Alert } from "@/components/ui";
import { useCreateDestination, getAdminDestinationError } from "@/hooks/use-admin-destinations";
import { DESTINATION_CATEGORIES, DESTINATION_SEASONS, CURRENCY_OPTIONS } from "@/types";

const destinationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  shortDescription: z.string().min(1, "Short description is required").max(500, "Too long"),
  fullDescription: z.string().min(1, "Full description is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  averageDailyCost: z.coerce.number().min(0, "Must be non-negative"),
  currency: z.string().min(1, "Currency is required"),
  category: z.string().min(1, "Category is required"),
  rating: z.coerce.number().min(0, "Must be at least 0").max(5, "Must be at most 5"),
  bestSeason: z.string().min(1, "Best season is required"),
  recommendedDays: z.coerce.number().min(1, "Must be at least 1 day"),
  highlightsText: z.string().min(1, "At least one highlight is required"),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

export default function AddDestinationPage() {
  const createMutation = useCreateDestination();
  const [created, setCreated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DestinationFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(destinationSchema) as any,
    defaultValues: {
      currency: "USD",
      category: "",
      bestSeason: "",
      rating: 4.0,
      averageDailyCost: 0,
      recommendedDays: 3,
    },
  });

  const onSubmit = useCallback(
    async (data: DestinationFormData) => {
      try {
        await createMutation.mutateAsync({
          title: data.title,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          city: data.city,
          country: data.country,
          averageDailyCost: data.averageDailyCost,
          currency: data.currency,
          category: data.category,
          rating: data.rating,
          bestSeason: data.bestSeason,
          recommendedDays: data.recommendedDays,
          highlights: data.highlightsText.split("\n").filter((h) => h.trim()),
          images: data.imageUrl ? [data.imageUrl] : [],
        });
        setCreated(true);
        reset();
      } catch {
        // Error handled by mutation
      }
    },
    [createMutation, reset]
  );

  const formError = createMutation.error ? getAdminDestinationError(createMutation.error) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/items/manage"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Add Destination</h1>
        <p className="mt-2 text-slate-600">
          Create a new destination for travelers to explore.
        </p>
      </div>

      {created && (
        <Alert variant="success" className="mb-6">
          <div className="flex items-center justify-between">
            <span>Destination created successfully!</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreated(false)}
            >
              Add Another
            </Button>
          </div>
        </Alert>
      )}

      {formError && (
        <Alert variant="error" className="mb-6">
          {formError}
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Title */}
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
                Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Kyoto, Japan"
                className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  errors.title ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                }`}
                {...register("title")}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* City / Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-slate-700">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g., Kyoto"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.city ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("city")}
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Country *
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="e.g., Japan"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.country ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("country")}
                />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="shortDescription" className="mb-1.5 block text-sm font-medium text-slate-700">
                Short Description *
              </label>
              <input
                id="shortDescription"
                type="text"
                placeholder="A brief one-line description"
                className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  errors.shortDescription ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                }`}
                {...register("shortDescription")}
              />
              {errors.shortDescription && <p className="mt-1 text-sm text-red-500">{errors.shortDescription.message}</p>}
            </div>

            {/* Full Description */}
            <div>
              <label htmlFor="fullDescription" className="mb-1.5 block text-sm font-medium text-slate-700">
                Full Description *
              </label>
              <textarea
                id="fullDescription"
                rows={4}
                placeholder="Detailed description of the destination..."
                className={`flex w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  errors.fullDescription ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                }`}
                {...register("fullDescription")}
              />
              {errors.fullDescription && <p className="mt-1 text-sm text-red-500">{errors.fullDescription.message}</p>}
            </div>

            {/* Category / Best Season */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category *
                </label>
                <select
                  id="category"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.category ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("category")}
                >
                  <option value="">Select category</option>
                  {DESTINATION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
              </div>
              <div>
                <label htmlFor="bestSeason" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Best Season *
                </label>
                <select
                  id="bestSeason"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.bestSeason ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("bestSeason")}
                >
                  <option value="">Select season</option>
                  {DESTINATION_SEASONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.bestSeason && <p className="mt-1 text-sm text-red-500">{errors.bestSeason.message}</p>}
              </div>
            </div>

            {/* Cost / Currency / Rating / Days */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="averageDailyCost" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Daily Cost *
                </label>
                <input
                  id="averageDailyCost"
                  type="number"
                  step="1"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.averageDailyCost ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("averageDailyCost")}
                />
                {errors.averageDailyCost && <p className="mt-1 text-sm text-red-500">{errors.averageDailyCost.message}</p>}
              </div>
              <div>
                <label htmlFor="currency" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Currency *
                </label>
                <select
                  id="currency"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.currency ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("currency")}
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.currency && <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>}
              </div>
              <div>
                <label htmlFor="rating" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Rating (0-5) *
                </label>
                <input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.rating ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("rating")}
                />
                {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>}
              </div>
              <div>
                <label htmlFor="recommendedDays" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Days *
                </label>
                <input
                  id="recommendedDays"
                  type="number"
                  min="1"
                  className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                    errors.recommendedDays ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                  }`}
                  {...register("recommendedDays")}
                />
                {errors.recommendedDays && <p className="mt-1 text-sm text-red-500">{errors.recommendedDays.message}</p>}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label htmlFor="highlightsText" className="mb-1.5 block text-sm font-medium text-slate-700">
                Highlights * (one per line)
              </label>
              <textarea
                id="highlightsText"
                rows={4}
                placeholder={"Fushimi Inari Shrine\nArashiyama Bamboo Grove\nKinkaku-ji Temple\nNishiki Market"}
                className={`flex w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  errors.highlightsText ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                }`}
                {...register("highlightsText")}
              />
              {errors.highlightsText && <p className="mt-1 text-sm text-red-500">{errors.highlightsText.message}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium text-slate-700">
                Image URL (optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  errors.imageUrl ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                }`}
                {...register("imageUrl")}
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Destination
                  </>
                )}
              </Button>
              <Link href="/items/manage">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
