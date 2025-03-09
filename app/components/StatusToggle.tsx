"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define Status enum for client-side use
export const Status = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

interface StatusToggleProps {
  id: number;
  initialStatus: Status;
}

export default function StatusToggle({ id, initialStatus }: StatusToggleProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleStatus = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const newStatus =
        status === Status.IN_PROGRESS ? Status.COMPLETED : Status.IN_PROGRESS;

      const response = await fetch(`/api/feedback/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err instanceof Error ? err.message : "Failed to update status");
      // Revert the status back if there was an error
      setStatus(initialStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={toggleStatus}
        disabled={isUpdating}
        className={`btn btn-sm ${
          status === Status.COMPLETED
            ? "btn-success text-white"
            : "btn-warning text-white"
        }`}
      >
        {isUpdating ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : status === Status.COMPLETED ? (
          "Completed"
        ) : (
          "In Progress"
        )}
      </button>
      {error && <div className="text-error text-xs">{error}</div>}
    </div>
  );
}
