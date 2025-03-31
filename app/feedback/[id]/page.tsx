import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Link from "next/link";
import { Status } from "@prisma/client";

interface FeedbackPageProps {
  params: {
    id: string;
  };
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return notFound();
  }

  const feedback = await prisma.feedback.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!feedback) {
    return notFound();
  }

  // Check if user has permission to view this feedback
  const userRole = session.user.role;
  const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";
  const isCategoryAdmin = userRole.startsWith("ADMIN_");
  const isOwner = feedback.userId === session.user.id;

  if (!isAdmin && !isOwner) {
    if (isCategoryAdmin) {
      const roleToCategory: Record<string, string> = {
        ADMIN_STAFF: "Staff",
        ADMIN_FACILITIES: "Facilities",
        ADMIN_EXTRACURRICULAR: "Extracurricular",
        ADMIN_RESOURCES: "Resources",
        ADMIN_CURRICULUM: "Curriculum",
        ADMIN_POLICIES: "Policies",
      };

      if (feedback.category !== roleToCategory[userRole]) {
        return notFound();
      }
    } else {
      return notFound();
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback Details</h1>
        <Link href="/" className="btn btn-ghost">
          Back to List
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{feedback.title}</h2>
              <div className="badge badge-outline mt-2">
                {feedback.category || "Uncategorized"}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{feedback.content}</p>
            </div>

            {feedback.rating && (
              <div>
                <h3 className="font-semibold mb-2">Rating</h3>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name={`rating-${feedback.id}`}
                      className="mask mask-star-2 bg-orange-400"
                      checked={feedback.rating === star}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="divider"></div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-base-content/70">Submitted By</p>
                <p>{feedback.user?.name || feedback.user?.email}</p>
              </div>
              <div>
                <p className="text-base-content/70">Status</p>
                <div
                  className={`badge ${
                    feedback.status === Status.COMPLETED
                      ? "badge-success text-white"
                      : "badge-warning text-white"
                  }`}
                >
                  {feedback.status === Status.COMPLETED
                    ? "Completed"
                    : "In Progress"}
                </div>
              </div>
              <div>
                <p className="text-base-content/70">Submitted On</p>
                <p>{new Date(feedback.createdAt).toLocaleDateString()}</p>
              </div>
              {feedback.status === Status.COMPLETED && (
                <div>
                  <p className="text-base-content/70">Completed On</p>
                  <p>{new Date(feedback.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
