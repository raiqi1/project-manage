"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HomePage from "./dashboard/page";

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token || !session) {
  //     router.push("/login");
  //   }
  // }, [session, router]);


  return (
    <div>
      <HomePage />
    </div>
  );
};

export default Home;
