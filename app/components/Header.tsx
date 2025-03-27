"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import TorchLogo from "./TorchLogo";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const router = useRouter();

  // Reset signing out state when session changes
  useEffect(() => {
    if (status === "authenticated") {
      setIsSigningOut(false);
    }
  }, [status]);

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSigningOut && status === "authenticated") {
      setIsSigningOut(true);
      try {
        await signOut({ redirect: false });
        router.push("/auth/signin");
      } catch (error) {
        console.error("Sign out failed:", error);
        setIsSigningOut(false);
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Don't render until session is checked
  if (status === "loading") {
    return (
      <header className="bg-base-100 shadow-lg">
        <div className="navbar container mx-auto">
          <div className="flex-1">
            <span className="text-xl font-bold flex items-center gap-2">
              <TorchLogo className="w-8 h-8" percent="0%" />
              TrackEd
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-base-100 shadow-lg" suppressHydrationWarning>
      <div className="navbar container mx-auto">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <TorchLogo className="w-8 h-8" percent={"0%"} />
            TrackEd
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-2 items-center">
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className={pathname === "/categories" ? "active" : ""}
              >
                Feedback Categories
              </Link>
            </li>
            {session?.user?.role === "SUPER_ADMIN" && (
              <li>
                <Link
                  href="/admin/users"
                  className={pathname === "/admin/users" ? "active" : ""}
                >
                  User Management
                </Link>
              </li>
            )}
            {session?.user ? (
              <>
                <li>
                  <span className="badge badge-primary">
                    {formatRole(session.user.role || "USER")}
                  </span>
                </li>
                <ThemeToggle />
                <details ref={dropdownRef} className="dropdown dropdown-end">
                  <summary className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 h-10 pt-1.5 rounded-full bg-primary text-primary-content grid place-items-center justify-center">
                      <span className="text-xl font-bold">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </summary>
                  <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <span className="text-sm font-medium truncate">
                        {session.user.email}
                      </span>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="text-error"
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </li>
                  </ul>
                </details>
              </>
            ) : (
              <>
                <ThemeToggle />
                <li>
                  <Link href="/auth/signin" className="btn btn-ghost btn-sm">
                    Sign In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
