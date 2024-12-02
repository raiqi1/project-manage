"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  useCreateAccountMutation,
  useGetUserLoginQuery,
  useLoginMutation,
} from "@/state/api";
import { signIn, useSession } from "next-auth/react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
  const { data: users, refetch } = useGetUserLoginQuery();
  const [createAccount, { isLoading: isRegisterLoading }] =
    useCreateAccountMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      router.push("/dashboard");
      refetch();
    } catch (error: any) {
      setErrorMessage(error?.data?.message || error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAccount({
        username,
        email,
        password,
      }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);
      router.push("/dashboard");
      refetch();
    } catch (error: any) {
      setErrorMessage(error?.data?.message || error.message);
    }
  };

  const isSubmitting = isLoginLoading || isRegisterLoading;

  function handleForgot() {
    router.push("/forgot-password");
  }

  useEffect(() => {}, []);

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.log("Error signing in with Google: ", error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {isRegistering ? "Register" : "Login"}
        </Typography>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
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
          {!isRegistering && (
            <div
              className="cursor-pointer text-sm text-blue-600"
              onClick={handleForgot}
            >
              <h1>Forgot Password ?</h1>
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500">{errorMessage}</div> // Show dynamic error message
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : isRegistering ? (
              "Register"
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <Button
          onClick={handleGoogleLogin}
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          fullWidth
          disabled={loadingGoogle}
        >
          {loadingGoogle ? <CircularProgress size={24} /> : "Login with Google"}
        </Button>
        <Button onClick={() => setIsRegistering(!isRegistering)} sx={{ mt: 2 }}>
          {isRegistering
            ? "Sudah punya akun? Login"
            : "Belum punya akun? Register"}
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
