import "./globals.css";
import Header from "./components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import StatusListener from "./components/StatusListener";
import Providers from "./components/Providers";

export const metadata = {
  title: "TrackEd - Student Feedback System",
  description:
    "A comprehensive feedback management system for educational institutions.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          {session?.user && (
            <>
              <Header />
              <StatusListener />
            </>
          )}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
