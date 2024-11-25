import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthLocalStorage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    // Jika ada token, render komponen anak
    <>{children}</>
  );
};

export default AuthLocalStorage;
