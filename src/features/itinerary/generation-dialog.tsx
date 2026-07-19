"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { Button, Modal, Alert } from "@/components/ui";

interface GenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
  error: string | null;
  onRetry: () => void;
  tripTitle: string;
}

export function GenerationDialog({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  error,
  onRetry,
  tripTitle,
}: GenerationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={isGenerating ? () => {} : onClose} title="Generate AI Itinerary" size="md">
      <div className="space-y-4">
        {isGenerating ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
            <p className="text-sm font-medium text-slate-900">Generating your itinerary...</p>
            <p className="mt-1 text-xs text-slate-500">This may take a moment. Please do not close this dialog.</p>
          </div>
        ) : error ? (
          <>
            <Alert variant="error">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </Alert>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={onRetry} leftIcon={<Sparkles className="h-4 w-4" />}>Retry</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Generate an AI-powered itinerary for <strong>{tripTitle}</strong>.
            </p>
            <p className="text-xs text-slate-500">
              This requires an active AI Trip Plan purchase for this trip.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                onClick={onConfirm}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Generate Itinerary
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
