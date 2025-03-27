import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import CreateUserForm from "./CreateUserForm";
import UserList from "./UserList";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-base-content">
        User Management
      </h1>
      <div className="grid gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl text-base-content mb-4">
              Create New User
            </h2>
            <CreateUserForm />
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl text-base-content mb-4">
              User List
            </h2>
            <UserList users={users} />
          </div>
        </div>
      </div>
    </div>
  );
}
