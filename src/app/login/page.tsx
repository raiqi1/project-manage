"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { useCreateAccountMutation, useLoginMutation } from "@/state/api";
import StoreProvider from "../redux";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const router = useRouter();

  const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
  const [createAccount, { isLoading: isRegisterLoading }] =
    useCreateAccountMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      router.push("/dashboard");
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
      router.push("/");
    } catch (error: any) {
      setErrorMessage(error?.data?.message || error.message);
    }
  };

  const isSubmitting = isLoginLoading || isRegisterLoading;

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
