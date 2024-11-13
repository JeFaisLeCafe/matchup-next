import { Poppins, Raleway } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";
import "./globals.css";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway"
});

export const metadata: Metadata = {
  title: "MatchUp",
  description: "Create and share photo quizzes with your friends!"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${raleway.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-background">
        <SessionProvider>
          <main className="flex flex-col">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
