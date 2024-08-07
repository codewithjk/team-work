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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { loading, user, error } = auth;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await dispatch(login(data.email, data.password));
  };
  useEffect(() => {
    if (user) {
      console.log("success");
      navigate("/home");
    }
    if (error) {
      console.log("dkle");
      toast.error(error);
    }
  }, [user, error, loading]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className=" w-4/5 max-w-5xl border-black">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className=" text-3xl font-semibold">Log In</h1>
          <p className=" text-sm text-neutral-500">
            Are new to TeamWork?{" "}
            <Link to="/signup" className=" underline underline-offset-4">
              Signup
            </Link>
          </p>
        </div>
        <div className="mb-8 flex flex-col gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-8 flex flex-col gap-2">
                <Button type="submit">Log In</Button>
                {loading && <p>loading</p>}
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
