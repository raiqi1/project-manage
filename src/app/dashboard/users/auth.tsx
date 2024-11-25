// // auth.ts (middleware untuk mengecek autentikasi)
// import { useRouter } from "next/router";
// import { useAppSelector } from "../redux";
// import { useEffect } from "react";

// const useAuth = () => {
//   const router = useRouter();
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       // Jika pengguna belum login, redirect ke halaman login
//       router.push("/login");
//     }
//   }, [isAuthenticated, router]);

//   return isAuthenticated;
// };

// export default useAuth;
