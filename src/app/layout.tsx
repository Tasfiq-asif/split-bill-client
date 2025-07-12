import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SplitBill - Split Bills Made Simple",
  description:
    "Track shared expenses and settle up with ease. Perfect for travel, dining, and group activities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
