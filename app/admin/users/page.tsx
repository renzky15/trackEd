import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import UserTable from "./UserTable";
import CreateUserForm from "./CreateUserForm";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <CreateUserForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <UserTable users={users} />
      </div>
    </div>
  );
}
