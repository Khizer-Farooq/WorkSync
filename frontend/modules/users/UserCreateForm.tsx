"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetDepartmentsQuery } from "@/redux/services/departmentApi";
import { useCreateUserMutation } from "@/redux/services/userApi";

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  departmentId: z.string().optional(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;

type Props = {
  onSuccess: () => void;
};

type ApiError = {
  data?: {
    message?: string;
  };
};

export default function UserCreateForm({ onSuccess }: Props) {
  const {
    data: departmentsResponse,
    isError: departmentsError,
    isFetching: fetchingDepartments,
    isLoading: loadingDepartments,
    refetch: refetchDepartments,
  } = useGetDepartmentsQuery();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const departments = departmentsResponse?.data || [];
  const departmentSelectDisabled =
    loadingDepartments || departmentsError || departments.length === 0;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departmentId: "",
      role: "EMPLOYEE",
    },
  });

  async function onSubmit(values: UserCreateFormValues) {
    try {
      await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        departmentId: values.departmentId
          ? Number(values.departmentId)
          : undefined,
        role: values.role,
      }).unwrap();

      reset();
      onSuccess();
    } catch (error) {
      const apiError = error as ApiError;

      setError("root", {
        message: apiError.data?.message || "User creation failed",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errors.root?.message && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          {...register("name")}
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ali Employee"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="ali@test.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register("departmentId")}
            disabled={departmentSelectDisabled}
            className="mt-1 w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-60"
          >
            <option value="">
              {loadingDepartments
                ? "Loading departments..."
                : departmentsError
                  ? "Departments could not load"
                  : departments.length === 0
                    ? "No departments available"
                    : "Select department"}
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {departmentsError && (
            <button
              type="button"
              onClick={() => refetchDepartments()}
              className="mt-1 text-sm font-medium text-gray-900 hover:underline"
            >
              Retry departments
            </button>
          )}
          {!departmentsError && fetchingDepartments && !loadingDepartments && (
            <p className="mt-1 text-xs text-gray-500">
              Refreshing departments...
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            {...register("role")}
            className="mt-1 w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
