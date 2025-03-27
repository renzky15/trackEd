"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th className="text-base-content">Name</th>
            <th className="text-base-content">Email</th>
            <th className="text-base-content">Role</th>
            <th className="text-base-content">LRN ID</th>
            <th className="text-base-content">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-base-200">
              <td className="text-base-content">{user.name}</td>
              <td className="text-base-content">{user.email}</td>
              <td className="text-base-content">{user.role}</td>
              <td className="text-base-content">{user.lrnId || "-"}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={loading === user.id}
                  className="btn btn-error btn-sm text-error-content"
                >
                  {loading === user.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
