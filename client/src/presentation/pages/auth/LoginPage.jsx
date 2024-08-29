import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../application/actions/authActions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { loading, user, error, isAuthenticated } = auth;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(login(data.email, data.password));
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
    if (error) {
      toast.error(error);
    }
  }, [user, error, loading]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 sm:p-12">
      <section className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Log In</h1>
          <p className="mt-2 text-sm text-gray-600">
            New to TeamWork?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end mb-6">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Log In
                </Button>
                {loading && (
                  <p className="text-center text-gray-600">Loading...</p>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
      <Toaster />
    </div>
  );
};

export default LoginPage;