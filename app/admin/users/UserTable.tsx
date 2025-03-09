"use client";

import { User } from "@prisma/client";
import { format } from "date-fns";

interface UserTableProps {
  users: Pick<
    User,
    "id" | "name" | "email" | "role" | "createdAt" | "updatedAt"
  >[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className="badge badge-outline">{user.role}</span>
              </td>
              <td>{format(user.createdAt, "PPP")}</td>
              <td>{format(user.updatedAt, "PPP")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
