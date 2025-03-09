import { notFound } from "next/navigation";
import FeedbackForm from "@/app/components/FeedbackForm";
import { prisma } from "@/app/lib/prisma";

interface EditFeedbackPageProps {
  params: {
    id: string;
  };
}

export default async function EditFeedback({ params }: EditFeedbackPageProps) {
  const feedback = await prisma.feedback.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!feedback) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Feedback</h1>
      <FeedbackForm mode="edit" initialData={feedback} />
    </div>
  );
}
