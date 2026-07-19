"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  StickyNote,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import { Button, Input, Alert, Card, CardContent } from "@/components/ui";
import {
  useCreateTrip,
  useUpdateTrip,
  useDestinations,
  useDestinationBySlug,
  getFriendlyError,
} from "@/hooks";
import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  TravelStyle,
} from "@/types";
import { TRAVEL_STYLE_OPTIONS, CURRENCY_OPTIONS } from "@/types";

const tripSchema = z
  .object({
    destinationSearch: z.string().min(1, "Destination is required"),
    destinationId: z.string().min(1, "Destination is required"),
    title: z.string().min(1, "Title is required").max(120, "Title must be 120 characters or less"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    travelers: z.number().min(1, "At least 1 traveler is required").max(50, "Maximum 50 travelers"),
    budget: z.number().min(0, "Budget must be non-negative"),
    currency: z.string().length(3, "Currency must be 3 letters"),
    travelStyle: z.enum(["budget", "mid-range", "luxury"]),
    interests: z.array(z.string()),
    accommodationPreference: z.string().max(100, "Must be 100 characters or less"),
    transportPreference: z.string().max(100, "Must be 100 characters or less"),
    notes: z.string().max(2000, "Notes must be 2000 characters or less"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    { message: "End date must be on or after start date", path: ["endDate"] }
  );

type TripFormData = z.infer<typeof tripSchema>;

interface TripFormProps {
  mode: "create" | "edit";
  initialData?: Trip;
  preselectedDestinationId?: string;
  preselectedDestinationSlug?: string;
}

function toIsoDate(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

export function TripForm({
  mode,
  initialData,
  preselectedDestinationId,
  preselectedDestinationSlug,
}: TripFormProps) {
  const router = useRouter();
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const [interestInput, setInterestInput] = useState("");
  const [showDestSearch, setShowDestSearch] = useState(false);
  const [destSearchInput, setDestSearchInput] = useState("");

  const defaultValues: TripFormData = {
    destinationId: initialData?.destinationId || preselectedDestinationId || "",
    title: initialData?.title || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "",
    travelers: initialData?.travelers || 1,
    budget: initialData?.budget || 0,
    currency: initialData?.currency || "USD",
    travelStyle: initialData?.travelStyle || "mid-range",
    interests: initialData?.interests || [],
    accommodationPreference: initialData?.accommodationPreference || "",
    transportPreference: initialData?.transportPreference || "",
    notes: initialData?.notes || "",
    destinationSearch: initialData?.destination?.title || "",
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues,
  });

  const watchedStartDate = useWatch({ control, name: "startDate" });
  const watchedEndDate = useWatch({ control, name: "endDate" });
  const watchedBudget = useWatch({ control, name: "budget" });
  const watchedTravelers = useWatch({ control, name: "travelers" });
  const watchedInterests = useWatch({ control, name: "interests" });
  const watchedDestinationSearch = useWatch({ control, name: "destinationSearch" });
  const watchedCurrency = useWatch({ control, name: "currency" });
  const watchedTravelStyle = useWatch({ control, name: "travelStyle" });

  const { data: destSearchResults } = useDestinations({
    search: destSearchInput.length >= 2 ? destSearchInput : undefined,
    limit: 6,
  });

  const preselectedDest = useDestinationBySlug(
    preselectedDestinationSlug || ""
  );

  useEffect(() => {
    if (preselectedDest.data) {
      const d = preselectedDest.data;
      setValue("destinationId", d._id);
      setValue("destinationSearch", d.title);
    }
  }, [preselectedDest.data, setValue]);

  useEffect(() => {
    if (initialData?.destination) {
      setValue("destinationSearch", initialData.destination.title);
    }
  }, [initialData, setValue]);

  const selectedDestTitle = showDestSearch ? "" : watchedDestinationSearch;

  const durationDays =
    watchedStartDate && watchedEndDate
      ? Math.max(
        1,
        Math.ceil(
          (new Date(watchedEndDate).getTime() -
            new Date(watchedStartDate).getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1
      )
      : 0;

  const dailyBudget =
    durationDays > 0 && watchedBudget > 0
      ? Math.round(watchedBudget / durationDays)
      : 0;

  const onSubmit = useCallback(
    async (data: TripFormData) => {
      try {
        if (mode === "create") {
          const payload: CreateTripRequest = {
            destinationId: data.destinationId,
            title: data.title,
            startDate: toIsoDate(data.startDate),
            endDate: toIsoDate(data.endDate),
            travelers: data.travelers,
            budget: data.budget,
            currency: data.currency,
            travelStyle: data.travelStyle as TravelStyle,
            interests: data.interests,
            accommodationPreference: data.accommodationPreference,
            transportPreference: data.transportPreference,
            notes: data.notes,
          };
          const result = await createTrip.mutateAsync(payload);
          router.push(`/trips/${result._id}`);
        } else if (initialData) {
          const payload: UpdateTripRequest = {
            title: data.title,
            startDate: toIsoDate(data.startDate),
            endDate: toIsoDate(data.endDate),
            travelers: data.travelers,
            budget: data.budget,
            currency: data.currency,
            travelStyle: data.travelStyle as TravelStyle,
            interests: data.interests,
            accommodationPreference: data.accommodationPreference,
            transportPreference: data.transportPreference,
            notes: data.notes,
          };
          await updateTrip.mutateAsync({ id: initialData._id, data: payload });
          router.push(`/trips/${initialData._id}`);
        }
      } catch (err) {
        const apiError = err as { status?: number; errors?: Record<string, string[]>; message?: string };
        if (apiError?.errors) {
          for (const [field, messages] of Object.entries(apiError.errors)) {
            if (messages && messages.length > 0) {
              setError(field as keyof TripFormData, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
      }
    },
    [mode, initialData, createTrip, updateTrip, router, setError]
  );

  const addInterest = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed && !watchedInterests.includes(trimmed)) {
        setValue("interests", [...watchedInterests, trimmed], {
          shouldValidate: true,
        });
      }
      setInterestInput("");
    },
    [watchedInterests, setValue]
  );

  const removeInterest = useCallback(
    (interest: string) => {
      setValue(
        "interests",
        watchedInterests.filter((i) => i !== interest),
        { shouldValidate: true }
      );
    },
    [watchedInterests, setValue]
  );

  const isPending = createTrip.isPending || updateTrip.isPending;
  const mutationError = getFriendlyError(createTrip.error || updateTrip.error);
  const isCompletedOrCancelled =
    initialData?.status === "completed" || initialData?.status === "cancelled";

  const destResults = destSearchResults?.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {mutationError && (
        <Alert variant="error" role="alert">
          {mutationError}
        </Alert>
      )}

      {/* Destination */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-500" />
          Destination
        </h2>
        <div className="relative">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Search Destination
          </label>
          <input
            type="text"
            value={showDestSearch ? destSearchInput : watchedDestinationSearch}
            onChange={(e) => {
              if (showDestSearch) {
                setDestSearchInput(e.target.value);
                setValue("destinationSearch", e.target.value, {
                  shouldValidate: false,
                });
              }
            }}
            onFocus={() => {
              setShowDestSearch(true);
              setDestSearchInput("");
            }}
            placeholder="Type to search destinations..."
            className="flex h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
          />
          {errors.destinationId && (
            <p className="mt-1 text-sm text-red-500" role="alert">
              {errors.destinationId.message}
            </p>
          )}

          {showDestSearch && destResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-[var(--radius-lg)] border border-slate-200 bg-white shadow-lg">
              {destResults.map((dest) => (
                <button
                  key={dest._id}
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors first:rounded-t-[var(--radius-lg)] last:rounded-b-[var(--radius-lg)]"
                  onClick={() => {
                    setValue("destinationId", dest._id, {
                      shouldValidate: true,
                    });
                    setValue("destinationSearch", dest.title);
                    setShowDestSearch(false);
                    setDestSearchInput("");
                  }}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{dest.title}</p>
                    <p className="text-xs text-slate-500">
                      {dest.city ? `${dest.city}, ` : ""}
                      {dest.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedDestTitle && !showDestSearch && (
            <p className="mt-1 text-sm text-slate-600">
              Selected: <span className="font-medium">{selectedDestTitle}</span>
            </p>
          )}
        </div>
      </section>

      {/* Trip Details */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-500" />
          Trip Details
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Trip Title"
              placeholder="e.g., Summer in Paris"
              disabled={isCompletedOrCancelled}
              error={errors.title?.message}
              {...register("title")}
            />
          </div>
          <Input
            label="Start Date"
            type="date"
            disabled={isCompletedOrCancelled}
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <Input
            label="End Date"
            type="date"
            min={watchedStartDate || undefined}
            disabled={isCompletedOrCancelled}
            error={errors.endDate?.message}
            {...register("endDate")}
          />
          <Input
            label="Number of Travelers"
            type="number"
            min={1}
            max={50}
            disabled={isCompletedOrCancelled}
            error={errors.travelers?.message}
            {...register("travelers", { valueAsNumber: true })}
          />
        </div>
      </section>

      {/* Budget */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary-500" />
          Budget
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Total Budget"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isCompletedOrCancelled}
            error={errors.budget?.message}
            {...register("budget", { valueAsNumber: true })}
          />
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Currency
            </label>
            <select
              disabled={isCompletedOrCancelled}
              className="flex h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("currency")}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.currency.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary-500" />
          Preferences
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Travel Style
            </label>
            <select
              disabled={isCompletedOrCancelled}
              className="flex h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("travelStyle")}
            >
              {TRAVEL_STYLE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Accommodation Preference"
            placeholder="e.g., Boutique hotel"
            disabled={isCompletedOrCancelled}
            error={errors.accommodationPreference?.message}
            {...register("accommodationPreference")}
          />
          <Input
            label="Transport Preference"
            placeholder="e.g., Public transit"
            disabled={isCompletedOrCancelled}
            error={errors.transportPreference?.message}
            {...register("transportPreference")}
          />
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Interests
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterest(interestInput);
                  }
                }}
                placeholder="Add an interest..."
                disabled={isCompletedOrCancelled}
                className="flex h-10 flex-1 rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addInterest(interestInput)}
                disabled={isCompletedOrCancelled || !interestInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {watchedInterests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {watchedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {interest}
                    {!isCompletedOrCancelled && (
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-primary-100"
                        aria-label={`Remove ${interest}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-primary-500" />
          Notes
        </h2>
        <div className="w-full">
          <textarea
            rows={4}
            placeholder="Any additional notes about your trip..."
            disabled={isCompletedOrCancelled}
            className="flex w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-500" role="alert">
              {errors.notes.message}
            </p>
          )}
        </div>
      </section>

      {/* Trip Summary Preview */}
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Trip Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {durationDays > 0 && (
              <div>
                <p className="text-slate-500">Duration</p>
                <p className="font-medium text-slate-900">
                  {durationDays} day{durationDays !== 1 ? "s" : ""}
                </p>
              </div>
            )}
            {dailyBudget > 0 && (
              <div>
                <p className="text-slate-500">Daily Budget</p>
                <p className="font-medium text-slate-900">
                  {watchedCurrency}
                  {dailyBudget.toLocaleString()}/day
                </p>
              </div>
            )}
            {watchedTravelers > 0 && (
              <div>
                <p className="text-slate-500">Travelers</p>
                <p className="font-medium text-slate-900">
                  {watchedTravelers}
                </p>
              </div>
            )}
            <div>
              <p className="text-slate-500">Style</p>
              <p className="font-medium text-slate-900 capitalize">
                {watchedTravelStyle}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending || isCompletedOrCancelled}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : mode === "create" ? (
            "Create Trip"
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to discard changes? This cannot be undone."
              )
            ) {
              router.back();
            }
          }}
        >
          Discard
        </Button>
      </div>

      {isCompletedOrCancelled && (
        <Alert variant="info">
          This trip is {initialData?.status} and cannot be edited.
        </Alert>
      )}
    </form>
  );
}
