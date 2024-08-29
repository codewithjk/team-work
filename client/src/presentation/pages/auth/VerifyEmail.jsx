import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  verifyMail,
  resendVerificationCode,
} from "../../../application/actions/authActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

const formSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Invalid code" })
    .max(6, { message: "Invalid code" }),
});

function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { loading, error, message, user } = auth;
  const userId = user.id;
  const verificationTokenExpiresAt = user.verificationTokenExpiresAt;

  // Function to calculate remaining time from the token expiration
  const calculateRemainingTime = () => {
    const expirationTime = Date.parse(verificationTokenExpiresAt) / 1000; // Convert to seconds
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const remainingTime = expirationTime - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const [timer, setTimer] = useState(calculateRemainingTime());
  const [isResendDisabled, setIsResendDisabled] = useState(timer > 0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const updatedTime = prev - 1;
          return updatedTime > 0 ? updatedTime : 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const onSubmit = (data) => {
    dispatch(verifyMail(data.code));
  };

  const handleResend = () => {
    dispatch(resendVerificationCode(userId));
    setTimer(calculateRemainingTime());
    setIsResendDisabled(true);
  };

  useEffect(() => {
    if (message) {
      toast.success("Email verified successfully!");
      navigate("/login");
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 sm:p-12">
      <section className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Didn’t receive a code?{" "}
            <Button
              type="button"
              variant="link"
              className="text-blue-500 hover:underline"
              onClick={handleResend}
              disabled={isResendDisabled || loading}
            >
              Resend Code
            </Button>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your verification code"
                        {...field}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading || timer <= 0}
                className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
              <p className="text-center text-gray-600">
                {timer > 0
                  ? `You can enter the code within ${formatTime(timer)}.`
                  : "You can request a new code now."}
              </p>
            </div>
          </form>
        </Form>
      </section>
      <Toaster />
    </div>
  );
}

export default VerifyEmail;
