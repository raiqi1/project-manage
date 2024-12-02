"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider from "./redux";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetProjectsQuery } from "@/state/api";
import { signOut, useSession } from "next-auth/react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingLogout, setIsLoadingLogout] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const name = session?.user?.name;
  console.log("name", name);
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data: projects, error } = useGetProjectsQuery();

  console.log("session", session);
  console.log("status", status);

  useEffect(() => {
    if (status !== "loading" && !session && !token) {
      router.push("/login");
    }
  }, [session, router, status, token]);

  const logoutHandler = async () => {
    setIsLoadingLogout(true);
    try {
      if (session) {
        await signOut({ redirect: false, callbackUrl: "/login" });
      } else if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/login");
      }
    } catch (error) {
      console.log("Error signing out: ", error);
    } finally {
      setIsLoadingLogout(false);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);


  return (
    <>
      <div className="absolute right-[50px] mt-2">
        <div className="flex gap-3 font-bold">
          <h1>Welcome {userName || name}</h1>
          <Button
            variant="contained"
            color="secondary"
            onClick={logoutHandler}
            size="small"
            disabled={loadingLogout}
          >
            {loadingLogout ? <CircularProgress size={20} /> : "Logout"}
          </Button>
        </div>
      </div>
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        <Sidebar />
        <main
          className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
            isSidebarCollapsed ? "" : "md:pl-64"
          }`}
        >
          <Navbar />
          {children}
        </main>
      </div>
    </>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
};

export default DashboardWrapper;
