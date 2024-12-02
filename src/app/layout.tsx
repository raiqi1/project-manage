"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { usePathname } from "next/navigation";
import StoreProvider from "./redux";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Next Js",
//   description: "Next Js",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider >
          <StoreProvider>{children}</StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
