import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../../application/actions/authActions";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

// Strong password schema
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must include at least one lowercase letter",
      })
      .regex(/\d/, { message: "Password must include at least one number" })
      .regex(/[\W_]/, {
        message: "Password must include at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const auth = useSelector((state) => state.auth);
  const { loading, user, error, message } = auth;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(resetPassword(token, data.password));
  };

  useEffect(() => {
    if (message) {
      navigate("/login");
    }
    if (error) {
      toast.error(error);
    }
  }, [user, error, loading, message]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 lg:p-24 bg-white text-gray-800">
      <section className="w-full sm:w-3/4 lg:w-2/5 max-w-2xl bg-white shadow-lg p-8 rounded-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">New Password</h1>
        </div>
        <div className="mb-8 flex flex-col gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eX@mple123"
                        {...field}
                        className="border-gray-300"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eX@mple123"
                        {...field}
                        className="border-gray-300"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-8 flex flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                >
                  Change Password
                </Button>
                {loading && <p>Loading...</p>}
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
