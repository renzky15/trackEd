import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import SignInForm from "./SignInForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <SignInForm />
      </div>
    </div>
  );
}
