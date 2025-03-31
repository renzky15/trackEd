import { prisma } from "@/app/lib/prisma";
import DeleteButton from "@/app/components/DeleteButton";
import StatusToggle from "@/app/components/StatusToggle";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import TorchLogo from "./components/TorchLogo";
import { Status, Role, Prisma } from "@prisma/client";

// Helper function to get category for admin role
function getCategoryForAdminRole(role: string): string | null {
  const roleToCategory: Record<string, string> = {
    ADMIN_STAFF: "Staff",
    ADMIN_FACILITIES: "Facilities",
    ADMIN_EXTRACURRICULAR: "Extracurricular",
    ADMIN_RESOURCES: "Resources",
    ADMIN_CURRICULUM: "Curriculum",
    ADMIN_POLICIES: "Policies",
  };
  return roleToCategory[role] || null;
}

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

  const userRole = session.user?.role as Role;
  const isRegularUser = userRole === "USER";

  try {
    // Base query with type safety
    const whereClause: Prisma.FeedbackWhereInput = {};

    // Filter feedback based on user role
    if (userRole?.startsWith("ADMIN_")) {
      const categoryForRole = getCategoryForAdminRole(userRole);
      if (categoryForRole) {
        whereClause.category = categoryForRole;
      }
    } else if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
      whereClause.userId = session.user?.id;
    }

    const feedback = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: [
        { status: "desc" }, // Show completed items first
        { category: "asc" },
        { createdAt: "desc" },
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

    // Calculate status statistics
    const stats = {
      total: feedback.length,
      completed: feedback.filter((f) => f.status === Status.COMPLETED).length,
      inProgress: feedback.filter((f) => f.status === Status.IN_PROGRESS)
        .length,
    };

    const canUpdateStatus =
      userRole === "SUPER_ADMIN" ||
      userRole === "ADMIN" ||
      userRole?.startsWith("ADMIN_");

    return (
      <main className="container mx-auto p-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Feedback List</h1>
              <div className="text-sm text-base-content/70 mt-1">
                Total: {stats.total} | Completed: {stats.completed} | In
                Progress: {stats.inProgress}
              </div>
            </div>
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
                    {/* <th>Rating</th> */}
                    <th>Content</th>
                    <th>Submitted By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        item.status === Status.COMPLETED ? "bg-success/5" : ""
                      }
                    >
                      <td className="font-medium">{item.title}</td>
                      <td>
                        <div className="badge badge-outline">
                          {item.category || "Uncategorized"}
                        </div>
                      </td>
                      {/* <td>
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
                      </td> */}
                      <td className="max-w-xs">
                        <p className="truncate">{item.content}</p>
                      </td>
                      <td>{item.user?.name || item.user?.email}</td>
                      <td>
                        <div className="flex flex-col">
                          <span>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          {item.status === Status.COMPLETED && (
                            <span className="text-xs text-base-content/60">
                              Completed:{" "}
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {canUpdateStatus ? (
                          <StatusToggle
                            id={item.id}
                            initialStatus={item.status}
                          />
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
                          <Link
                            href={`/feedback/${item.id}`}
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
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </Link>
                          {isRegularUser &&
                            item.status !== Status.COMPLETED && (
                              <>
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
                                <DeleteButton id={item.id} />
                              </>
                            )}
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
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return (
      <main className="container mx-auto p-4">
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
          <span>Failed to load feedback. Please try again later.</span>
        </div>
      </main>
    );
  }
}
