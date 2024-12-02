"use client";
import {
  useResetPasswordMutation,
  useSendEmailMutation,
  useVerifyTokenMutation,
} from "@/state/api";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { LucideSquareChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaLinesLeaning } from "react-icons/fa6";

export default function ForgotPage() {
  const [sendEmail, { isLoading, isError, error }] = useSendEmailMutation();
  const [verifyOtp, { error: tokenError, isSuccess }] =
    useVerifyTokenMutation();
  const [resetPassword, { error: resetError }] = useResetPasswordMutation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pesan, setPesan] = useState("");
  const [errorForgot, setErrorForgot] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [pesanToken, setPesanToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showReset, setShowReset] = useState(false);

  console.log("error permintaan", (error as any)?.data);
  console.log(" token error", tokenError as any);
  console.log("error forgot", errorForgot);
  console.log("success verify", isSuccess);
  console.log("show reset section", showReset);
  console.log("error reset password", resetError as any);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("email", email);
    try {
      const result = await sendEmail({ email }).unwrap();
      console.log("result", result);
      localStorage.setItem("email", result?.user?.email);
      setPesan(result?.message);
      setShowOtpInput(true);
      setEmail("");
      setErrorForgot("");
    } catch (error: any) {
      setErrorForgot(error?.data?.message || error?.message);
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("otp", otp);
    try {
      const localEmail = localStorage.getItem("email");
      const resultOtp = await verifyOtp({
        email: localEmail,
        otp,
      }).unwrap();
      setPesanToken(resultOtp.data);
      setOtp("");
      setPesan("");
      alert("Otp berhasil diverifikasi");
      setShowReset(true);
    } catch (error: any) {
      setPesan("");
      console.log(error.data.message);
    }
  };

  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("new password", newPassword);
    try {
      const localEmail = localStorage.getItem("email");
      const result = await resetPassword({
        email: localEmail,
        newPassword,
      });
      router.push("/login");
      alert(result?.data?.message);
    } catch (error: any) {
      console.log(error?.data?.message);
    }
  };

  console.log("show otp input", showOtpInput);

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100vh"
        justifyContent="center"
      >
        {/* <Typography variant="h5" component="h1">
          Forgot Passowrd
        </Typography> */}

        <form
          action=""
          className="border-1 border p-10"
          onSubmit={
            !showOtpInput && !showReset
              ? submitEmail
              : showOtpInput && !showReset
                ? submitOtp
                : submitNewPassword
          }
        >
          {!showOtpInput && !showReset && (
            <>
              <h1 className="">Enter Your Email for reset the Password</h1>
              <TextField
                label="email"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}

          {showOtpInput && !showReset && (
            <>
              <h1 className="">Input Your OTP Code </h1>
              <TextField
                label="Otp"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </>
          )}

          {showReset && (
            <>
              <h1 className="">Input Your New Password </h1>
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </>
          )}

          <Button type="submit" fullWidth variant="contained" color="primary">
            {isLoading && !showOtpInput ? (
              <CircularProgress size={24} />
            ) : showOtpInput && !showReset ? (
              "Verify"
            ) : !showOtpInput && !showReset ? (
              "Send"
            ) : (
              "Submit"
            )}
          </Button>
          <div className="mt-2">
            {pesan && <div className="text-green-600">{pesan}</div>}
            {errorForgot ? (
              <div className="text-red-600">{errorForgot}</div>
            ) : (
              (error as any)?.data && (
                <div className="text-red-600">{(error as any)?.data}</div>
              )
            )}
            {(tokenError as any)?.data && (
              <div className="text-red-600">
                {(tokenError as any)?.data?.message}
              </div>
            )}
          </div>
        </form>
      </Box>
    </Container>
  );
}
