"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Modal, Button, Alert } from "@/components/ui";
import { cn } from "@/utils";

interface GenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
  error: string | null;
  onRetry: () => void;
  creditsRemaining: number;
  creditsRequired: number;
  tripTitle: string;
}

const PROGRESS_STEPS = [
  { key: "preparing", label: "Preparing request", icon: Clock },
  { key: "analyzing", label: "Analyzing destination", icon: MapPin },
  { key: "generating", label: "Generating itinerary", icon: Sparkles },
  { key: "optimizing", label: "Optimizing schedule", icon: Calendar },
  { key: "finalizing", label: "Finalizing", icon: CheckCircle },
] as const;

export function GenerationDialog({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  error,
  onRetry,
  creditsRemaining,
  creditsRequired,
  tripTitle,
}: GenerationDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const prevGeneratingRef = useRef(isGenerating);

  useEffect(() => {
    if (isGenerating && !prevGeneratingRef.current) {
      setCurrentStep(0);
      const intervals = [2000, 4000, 8000, 12000];
      const timers: ReturnType<typeof setTimeout>[] = [];

      intervals.forEach((delay, i) => {
        timers.push(
          setTimeout(() => {
            if (i < PROGRESS_STEPS.length - 1) {
              setCurrentStep(i + 1);
            }
          }, delay)
        );
      });

      prevGeneratingRef.current = true;
      return () => timers.forEach(clearTimeout);
    }

    if (!isGenerating) {
      prevGeneratingRef.current = false;
    }
  }, [isGenerating]);

  const hasEnoughCredits = creditsRemaining >= creditsRequired;

  const handleClose = useCallback(() => {
    if (!isGenerating) {
      onClose();
    }
  }, [isGenerating, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isGenerating ? "Generating Itinerary" : "Generate AI Itinerary"}
      size="md"
    >
      <div className="space-y-4">
        {error ? (
          <>
            <Alert variant="error">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </Alert>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={onRetry} leftIcon={<RefreshCw className="h-4 w-4" />}>
                Retry
              </Button>
            </div>
          </>
        ) : isGenerating ? (
          <>
            <p className="text-sm text-slate-600">
              Generating your personalized itinerary for{" "}
              <span className="font-medium">{tripTitle}</span>...
            </p>
            <div className="space-y-3">
              {PROGRESS_STEPS.map((step, i) => {
                const isActive = i === currentStep;
                const isComplete = i < currentStep;
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.key}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--radius-md)] p-3 transition-colors",
                      isActive && "bg-primary-50",
                      isComplete && "opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        isActive && "bg-primary-500 text-white",
                        isComplete && "bg-green-100 text-green-600",
                        !isActive && !isComplete && "bg-slate-100 text-slate-400"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        isActive && "font-medium text-slate-900",
                        !isActive && "text-slate-500"
                      )}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-slate-400">
              This may take up to 30 seconds. Please don&apos;t close this dialog.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Generate a personalized AI itinerary for{" "}
              <span className="font-medium">{tripTitle}</span>.
            </p>

            <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Credits required</span>
                <span className="font-medium text-slate-900">{creditsRequired}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">Credits remaining</span>
                <span
                  className={cn(
                    "font-medium",
                    hasEnoughCredits ? "text-green-600" : "text-red-600"
                  )}
                >
                  {creditsRemaining}
                </span>
              </div>
            </div>

            {!hasEnoughCredits && (
              <Alert variant="warning">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>You don&apos;t have enough AI credits to generate this itinerary.</span>
                </div>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {hasEnoughCredits ? (
                <Button onClick={onConfirm} leftIcon={<Sparkles className="h-4 w-4" />}>
                  Generate Itinerary
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleClose();
                    window.location.assign("/settings");
                  }}
                  leftIcon={<CreditCard className="h-4 w-4" />}
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
