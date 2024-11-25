import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  useCreateAccountMutation,
  useGetUsersQuery,
  useLoginMutation,
} from "@/state/api";

const AuthProvider = ({ children }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Tambahkan state untuk username
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [createAccount, { isError }] = useCreateAccountMutation();

  const { data: user } = useGetUsersQuery();

  console.log("user from authProvider", user);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      if (!savedToken) {
        router.push("/login");
      }
    }
  }, [router, token]);

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/login");
  //   }
  // }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      setToken(result.token);
      router.push("/");
    } catch (error: any) {
      console.error("Login gagal:", error);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAccount({
        username,
        email,
        password,
      }).unwrap(); // Sertakan username
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      setToken(result.token);
      router.push("/");
    } catch (error: any) {
      console.error("Pendaftaran gagal:", error);
    }
  };

  if (isLoggingOut) {
    return (
      <Container maxWidth="xs" className="border border-solid">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
    helo
    </>
    // <>
    //   {token ? (
    //     children
    //   ) : (
    //     <Container maxWidth="xs">
    //       <Box
    //         display="flex"
    //         flexDirection="column"
    //         alignItems="center"
    //         justifyContent="center"
    //         height="70vh"
    //         style={{
    //           border: "1px solid",
    //           padding: "20px",
    //           borderRadius: "10px",
    //         }}
    //         marginTop="20vh"
    //       >
    //         <Typography variant="h4" component="h1" gutterBottom>
    //           {isRegistering ? "Register" : "Login"}
    //         </Typography>
    //         <form onSubmit={isRegistering ? handleCreateAccount : handleLogin}>
    //           {isRegistering && ( // Tampilkan input username hanya saat register
    //             <TextField
    //               label="Username"
    //               variant="outlined"
    //               fullWidth
    //               margin="normal"
    //               value={username}
    //               onChange={(e) => setUsername(e.target.value)}
    //               required
    //             />
    //           )}
    //           <TextField
    //             label="Email"
    //             variant="outlined"
    //             fullWidth
    //             margin="normal"
    //             type="email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             required
    //           />
    //           <TextField
    //             label="Password"
    //             variant="outlined"
    //             fullWidth
    //             margin="normal"
    //             type="password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             required
    //           />
    //           <Button
    //             type="submit"
    //             fullWidth
    //             variant="contained"
    //             color="primary"
    //             sx={{ mt: 2 }}
    //             disabled={isLoading}
    //           >
    //             {isLoading
    //               ? "Loading..."
    //               : isRegistering
    //                 ? "Register"
    //                 : "Login"}
    //           </Button>
    //         </form>
    //         <Button
    //           onClick={() => setIsRegistering(!isRegistering)}
    //           sx={{ mt: 2 }}
    //         >
    //           {isRegistering
    //             ? "Sudah punya akun? Login"
    //             : "Belum punya akun? Register"}
    //         </Button>
    //         {error && (
    //           <Typography color="error" variant="body2" mt={2}>
    //             {isRegistering ? "Pendaftaran gagal: " : "Login gagal: "}
    //             {error && "status" in error ? error.status : "Unknown error"}
    //           </Typography>
    //         )}
    //       </Box>
    //     </Container>
    //   )}
    // </>
  );
};

export default AuthProvider;
