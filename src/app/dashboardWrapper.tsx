"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider from "./redux";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/state/api";
import AuthWrapper from "./login/page";
import LoginPage from "./login/page";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingLogout, setIsLoadingLogout] = useState(false);
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const router = useRouter();

  const logoutHandler = async () => {
    setIsLoadingLogout(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/login");
    } catch (error) {
      console.log("error", error);
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
          <h1>Welcome {userName}</h1>
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, isCheckingAuth]);

  // if (isCheckingAuth) {
  //   return (
  //     <Box
  //       display="flex"
  //       flexDirection="column"
  //       alignItems="center"
  //       justifyContent="center"
  //       height="100vh"
  //     >
  //       <CircularProgress />
  //       <Typography variant="body1" mt={2}>
  //         Loading
  //       </Typography>
  //     </Box>
  //   );
  // }

  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
};

export default DashboardWrapper;
