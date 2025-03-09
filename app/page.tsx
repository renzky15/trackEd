import { prisma } from "@/app/lib/prisma";
import DeleteButton from "@/app/components/DeleteButton";
import StatusToggle from "@/app/components/StatusToggle";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TorchLogo from "./components/TorchLogo";
import { Status } from "@prisma/client";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="container mx-auto p-4">
        <div className="hero min-h-[80vh] bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="flex justify-center mb-6">
                <TorchLogo className="w-24 h-24 text-primary" />
              </div>
              <h1 className="text-5xl font-bold mb-8">Welcome to TrackEd</h1>
              <p className="text-xl mb-8">
                Track and improve educational experiences. Join our platform to
                submit and monitor feedback.
              </p>
              <Link href="/auth/signin" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const userRole = session.user?.role;
  const isRegularUser = userRole === "USER";

  // Base query
  let whereClause = {};

  // Filter feedback based on user role
  if (userRole?.startsWith("ADMIN_")) {
    const roleToCategory: Record<string, string> = {
      ADMIN_STAFF: "Staff",
      ADMIN_FACILITIES: "Facilities",
      ADMIN_EXTRACURRICULAR: "Extracurricular",
      ADMIN_RESOURCES: "Resources",
      ADMIN_CURRICULUM: "Curriculum",
      ADMIN_POLICIES: "Policies",
    };
    whereClause = {
      category: roleToCategory[userRole],
    };
  } else if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
    whereClause = {
      userId: session.user?.id,
    };
  }

  const feedback = await prisma.feedback.findMany({
    where: whereClause,
    orderBy: [
      {
        category: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const canUpdateStatus =
    userRole === "SUPER_ADMIN" ||
    userRole === "ADMIN" ||
    userRole?.startsWith("ADMIN_");

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback List</h1>
        {isRegularUser && (
          <Link href="/feedback/new" className="btn btn-primary">
            Add Feedback
          </Link>
        )}
      </div>

      {feedback.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Content</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.title}</td>
                  <td>
                    <div className="badge badge-outline">
                      {item.category || "Uncategorized"}
                    </div>
                  </td>
                  <td>
                    <div className="rating rating-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name={`rating-${item.id}`}
                          className="mask mask-star-2 bg-orange-400"
                          checked={item.rating === star}
                          readOnly
                        />
                      ))}
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <p className="truncate">{item.content}</p>
                  </td>
                  <td>{item.user?.name || item.user?.email}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    {canUpdateStatus ? (
                      <StatusToggle id={item.id} initialStatus={item.status} />
                    ) : (
                      <div
                        className={`badge ${
                          item.status === Status.COMPLETED
                            ? "badge-success text-white"
                            : "badge-warning text-white"
                        }`}
                      >
                        {item.status === Status.COMPLETED
                          ? "Completed"
                          : "In Progress"}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {isRegularUser && (
                        <Link
                          href={`/feedback/${item.id}/edit`}
                          className="btn btn-sm btn-ghost"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Link>
                      )}
                      {isRegularUser && <DeleteButton id={item.id} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="hero bg-base-200 rounded-box py-12">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold mb-4">No Feedback Yet</h2>
              <p className="text-base-content/70 mb-6">
                {isRegularUser
                  ? "Be the first to share your thoughts!"
                  : "No feedback available."}
              </p>
              {isRegularUser && (
                <Link href="/feedback/new" className="btn btn-primary">
                  Add Feedback
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
