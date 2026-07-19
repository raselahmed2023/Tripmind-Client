"use client";

import { useCallback } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { useDeleteTrip, getFriendlyError } from "@/hooks";
import type { Trip } from "@/types";

interface DeleteTripModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteTripModal({
  trip,
  isOpen,
  onClose,
  onSuccess,
}: DeleteTripModalProps) {
  const deleteTrip = useDeleteTrip();

  const handleDelete = useCallback(async () => {
    if (!trip) return;
    try {
      await deleteTrip.mutateAsync(trip._id);
      onSuccess();
      onClose();
    } catch {
      // Error is handled by the mutation
    }
  }, [trip, deleteTrip, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!deleteTrip.isPending) {
      onClose();
    }
  }, [deleteTrip.isPending, onClose]);

  const errorMessage = getFriendlyError(deleteTrip.error);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Trip"
      description="This action cannot be undone."
    >
      <div className="space-y-4">
        {deleteTrip.isError && (
          <div className="rounded-[var(--radius-md)] bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">&ldquo;{trip?.title}&rdquo;</span>?
              This will permanently remove the trip and all its data.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteTrip.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={deleteTrip.isPending}
            disabled={deleteTrip.isPending}
          >
            {deleteTrip.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Trip"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
