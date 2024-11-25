import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/state/api";

const AuthProvider = ({ children }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null); // Tambahkan state untuk token
  const router = useRouter();
  const [login, { data, isLoading, error }] = useLoginMutation();

  useEffect(() => {
    // Ambil token dari localStorage hanya jika di sisi client
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({
        email,
        password,
      }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      setToken(result.token); // Update state token setelah login berhasil
      router.push("/");
    } catch (error: any) {
      console.error("Login gagal:", error);
    }
  };

  // Tampilkan `children` jika token ada, jika tidak tampilkan form login
  return (
    <>
      {token ? (
        children
      ) : (
        <Container maxWidth="xs">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </form>
            {error && (
              <Typography color="error" variant="body2" mt={2}>
                Login gagal:{" "}
                {error && "status" in error ? error.status : "Unknown error"}
              </Typography>
            )}
          </Box>
        </Container>
      )}
    </>
  );
};

export default AuthProvider;
