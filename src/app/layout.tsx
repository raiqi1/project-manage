"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { usePathname } from "next/navigation";
import StoreProvider from "./redux";

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
  const pathname = usePathname();

  const publicPages = ["/login"];

  const isPublicPage = publicPages.includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
