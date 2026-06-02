"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCreateEmployeeMutation } from "@/redux/services/userApi";
import type { RootState } from "@/redux/store";
import { z } from "zod";


export const registerEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  departmentId: z
    .string()
    .optional(),
});

export type RegisterEmployeeFormValues = z.infer<
  typeof registerEmployeeSchema
>;

export default function RegisterEmployeeForm() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterEmployeeFormValues>({
    resolver: zodResolver(registerEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departmentId: "",
    },
  });

  async function onSubmit(values: RegisterEmployeeFormValues) {
    if (user?.role !== "ADMIN") {
      setError("root", {
        message: "Only admin can register employees",
      });
      return;
    }

    try {
      await createEmployee({
        name: values.name,
        email: values.email,
        password: values.password,
        departmentId: values.departmentId
          ? Number(values.departmentId)
          : undefined,
      }).unwrap();

      reset();

      router.push("/dashboard");
    } catch {
      setError("root", {
        message: "Employee registration failed",
      });
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Register Employee
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Only admin can create employee accounts.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          {errors.root?.message && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {errors.root.message}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Employee Name
            </label>
            <input
              {...register("name")}
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Ali Employee"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Employee Email
            </label>
            <input
              {...register("email")}
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="ali@test.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="123456"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Department ID
            </label>
            <input
              {...register("departmentId")}
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional for now. Later we can replace this with department
              dropdown.
            </p>
          </div>

          <button
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-gray-900 py-2 font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Registering..." : "Register Employee"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}