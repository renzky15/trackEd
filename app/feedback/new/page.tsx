"use client";

import FeedbackForm from "@/app/components/FeedbackForm";
import { useSearchParams } from "next/navigation";

export default function NewFeedback() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Feedback</h1>
      <FeedbackForm
        mode="create"
        initialData={
          category
            ? {
                title: "",
                content: "",
                rating: 5,
                category: category,
              }
            : undefined
        }
      />
    </div>
  );
}
