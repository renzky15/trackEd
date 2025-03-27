"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";

// Define role options as a constant array
const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN_STAFF", label: "Staff Admin" },
  { value: "ADMIN_FACILITIES", label: "Facilities Admin" },
  { value: "ADMIN_EXTRACURRICULAR", label: "Extracurricular Admin" },
  { value: "ADMIN_RESOURCES", label: "Resources Admin" },
  { value: "ADMIN_CURRICULUM", label: "Curriculum Admin" },
  { value: "ADMIN_POLICIES", label: "Policies Admin" },
] as const;

export default function CreateUserForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("USER");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const role = formData.get("role") as Role;

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      role,
      ...(role === "USER" && { lrnId: formData.get("lrnId") as string }),
    };

    console.log("Submitting user data:", { ...data, password: "[REDACTED]" }); // Debug log

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create user");
      }

      // Reset form using the form reference
      if (formRef.current) {
        formRef.current.reset();
      }
      router.refresh();
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error bg-error text-error-content">
              <span>{error}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                required
                className="input input-bordered w-full bg-base-200 text-base-content"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                required
                className="input input-bordered w-full bg-base-200 text-base-content"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                required
                className="input input-bordered w-full bg-base-200 text-base-content"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Role</span>
              </label>
              <select
                name="role"
                className="select select-bordered w-full bg-base-200 text-base-content"
                required
                defaultValue="USER"
                onChange={(e) => setSelectedRole(e.target.value as Role)}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedRole === "USER" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">LRN ID</span>
                </label>
                <input
                  type="text"
                  name="lrnId"
                  placeholder="Enter LRN ID"
                  required
                  className="input input-bordered w-full bg-base-200 text-base-content"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full bg-primary hover:bg-primary-focus text-primary-content"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
