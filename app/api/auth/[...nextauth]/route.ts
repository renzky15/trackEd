import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorization attempt for email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log("User found:", user ? "Yes" : "No");

        if (!user || !user?.password) {
          console.log("User not found or no password:", credentials.email);
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log("Password correct:", isCorrectPassword);

        if (!isCorrectPassword) {
          console.log("Invalid password for user:", credentials.email);
          throw new Error("Invalid credentials");
        }

        console.log("Authorization successful for user:", credentials.email);
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback - user:", user ? "Yes" : "No");
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token ? "Yes" : "No");
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("Auth error:", code, metadata);
    },
    warn(code) {
      console.warn("Auth warning:", code);
    },
    debug(code, metadata) {
      console.log("Auth debug:", code, metadata);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
