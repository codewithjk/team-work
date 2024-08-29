// import React from "react";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { signup } from "../../../application/actions/authActions";
// import { useEffect } from "react";
// import { Toaster } from "sonner";
// import { toast } from "sonner";
// import { useSelector } from "react-redux";

// const formSchema = z
//   .object({
//     name: z.string().min(3, { message: "Name must be at least 3 characters " }),
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters" }),
//     confirmPassword: z
//       .string()
//       .min(6, { message: "Confirm password must be at least 6 characters" }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// function SignupPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const auth = useSelector((state) => state.auth);
//   const { loading, error, message, user } = auth;

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const googleLogin = () => {
//     console.log("google");
//     window.location.href = `${
//       import.meta.env.VITE_BACKEND_API_BASE_URL
//     }/auth/google`;
//   };

//   const githubLogin = () => {
//     console.log("gothub");
//     window.location.href = `${
//       import.meta.env.VITE_BACKEND_API_BASE_URL
//     }/auth/github`;
//   };

//   const onSubmit = (data) => {
//     const { email, name, password } = data;
//     dispatch(signup({ email, name, password }));
//     console.log(data);
//   };
//   useEffect(() => {
//     if (error) {
//       console.log("signup error");
//       toast.error(error);
//     } else if (user) {
//       console.log("navigating to verify")
//       navigate("/verify-email");
//     }
//   }, [message, error, user]);
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 sm:p-12">
//       <section className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-semibold text-gray-800">Signup</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-500 hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//         <div>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <div className="mb-6">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="example@gmail.com"
//                           {...field}
//                           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="mb-6">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Fullname</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="John Doe"
//                           {...field}
//                           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="mb-6">
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="password"
//                           {...field}
//                           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="mb-6">
//                 <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="password"
//                           {...field}
//                           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="mt-8 flex flex-col gap-4">
//                 <Button
//                   type="submit"
//                   className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   Sign Up
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>

//         <div className="mt-8 flex flex-col gap-4">
//           <Button
//             onClick={googleLogin}
//             className="w-full py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             Google
//           </Button>
//           <Button
//             onClick={githubLogin}
//             className="w-full py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
//           >
//             GitHub
//           </Button>
//         </div>
//       </section>
//       <Toaster />
//     </div>
//   );
// }

// export default SignupPage;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signup } from "../../../application/actions/authActions";
import { Toaster, toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const formSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters " }),
    email: z.string().email({ message: "Invalid email address" }),
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

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { loading, error, message, user } = auth;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const googleLogin = () => {
    console.log("google");
    window.location.href = `${
      import.meta.env.VITE_BACKEND_API_BASE_URL
    }/auth/google`;
  };

  const githubLogin = () => {
    console.log("github");
    window.location.href = `${
      import.meta.env.VITE_BACKEND_API_BASE_URL
    }/auth/github`;
  };

  const onSubmit = (data) => {
    const { email, name, password } = data;
    dispatch(signup({ email, name, password }));
    console.log(data);
  };

  useEffect(() => {
    if (error) {
      console.log("signup error");
      toast.error(error);
    } else if (user) {
      console.log("navigating to verify");
      navigate("/verify-email");
    }
  }, [message, error, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 sm:p-12">
      <section className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-primary">Signup</h1>
          <p className="mt-2 text-sm text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Fullname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <FormLabel className="text-primary">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                        className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                        className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="mt-8 flex flex-col gap-4">
          <Button
            onClick={googleLogin}
            className="w-full py-2 text-black border border-secondary bg-white flex items-center justify-center gap-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <FcGoogle size={20} />
            Sign Up with Google
          </Button>
          <Button
            onClick={githubLogin}
            className="w-full py-2 text-white bg-black flex items-center justify-center gap-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            <FaGithub size={20} />
            Sign Up with GitHub
          </Button>
        </div>
      </section>
      <Toaster />
    </div>
  );
}

export default SignupPage;