"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HomePage from "./dashboard/page";
import { useGetProjectsQuery } from "@/state/api";

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: projects, error } = useGetProjectsQuery();
  console.log("error from home", error);

  useEffect(() => {
    if (status !== "loading" && !session) {
      if (error && typeof error === "object" && (error as any).status === 401) {
        router.push("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
      }
    }
  }, [router, session, status, error]);

  return (
    <div>
      <HomePage />
    </div>
  );
};

export default Home;
