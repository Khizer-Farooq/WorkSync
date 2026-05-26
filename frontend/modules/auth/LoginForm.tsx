"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { useLoginMutation } from "@/redux/services/authApi";
import { setCredentials } from "@/redux/features/authSlice";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await login(values).unwrap();

      dispatch(
        setCredentials({
          token: response.data.accessToken,
          user: response.data.user,
        })
      );

      router.push("/dashboard");
    } catch {
      setError("root", {
        message: "Invalid email or password",
      });
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">WorkSync</h1>

        <p className="text-sm text-gray-500 mt-1">
          Login to manage projects, tasks, and shifts.
        </p>

        {errors.root?.message && (
          <div className="mt-4 rounded-lg bg-red-50 text-red-600 text-sm p-3">
            {errors.root.message}
          </div>
        )}

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">Email</label>

          <input
            {...register("email")}
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
            placeholder=""
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <input
            {...register("password")}
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
            placeholder=""
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-gray-900 text-white py-2 font-medium disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}