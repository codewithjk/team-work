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
import { Toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { forgotPassword } from "../../../application/actions/authActions";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "fill this field" })
    .email({ message: "Invalid email address" }),
});

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { loading, user, error } = auth;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    await dispatch(forgotPassword(data.email, data.password));
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
    if (error) {
      toast.error(error);
    }
  }, [user, error, loading]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 lg:p-24 bg-white text-gray-800">
      <section className="w-full sm:w-3/4 lg:w-2/5 max-w-2xl bg-white shadow-lg p-8 rounded-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Find your account
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            You will receive a reset password mail
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
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        className="border-gray-300"
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
                  Send request
                </Button>
                {loading && <p>Loading...</p>}
              </div>
              <div className="mt-8 flex flex-row gap-2 justify-end">
                <p className="text-sm text-gray-600">
                  <Link to="/login" className="underline underline-offset-4">
                    Go back
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
