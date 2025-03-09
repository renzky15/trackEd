"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Status } from "@prisma/client";

interface FeedbackFormProps {
  initialData?: {
    id?: number;
    title: string;
    content: string;
    rating: number;
    category?: string;
    status?: Status;
  };
  mode: "create" | "edit";
}

// Predefined categories
export const CATEGORIES = [
  "Staff",
  "Facilities",
  "Extracurricular",
  "Resources",
  "Curriculum",
  "Policies",
  "Others",
] as const;

export default function FeedbackForm({ initialData, mode }: FeedbackFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    rating: number;
    category: string;
    status: Status;
  }>({
    title: "",
    content: "",
    rating: 5,
    category: "",
    status: "IN_PROGRESS",
  });

  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      content: initialData?.content || "",
      rating: initialData?.rating || 5,
      category: initialData?.category || "",
      status: initialData?.status || "IN_PROGRESS",
    });
    setMounted(true);
  }, [initialData]);

  if (!mounted) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-base-300 rounded"></div>
            <div className="h-24 bg-base-300 rounded"></div>
            <div className="h-10 bg-base-300 rounded"></div>
            <div className="h-10 bg-base-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url =
        mode === "create"
          ? "/api/feedback"
          : `/api/feedback/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          rating: Number(formData.rating),
          category: formData.category,
          ...(mode === "edit" && { status: formData.status }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input input-bordered w-full"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-control w-full flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="textarea textarea-bordered h-24"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-control w-full flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <div className="rating rating-lg">
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name="rating"
                  className="mask mask-star-2 bg-orange-400"
                  checked={formData.rating === value}
                  onChange={() => setFormData({ ...formData, rating: value })}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="select select-bordered w-full"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : mode === "create" ? (
                "Submit Feedback"
              ) : (
                "Update Feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
