import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { API_URL, TOKEN_KEY } from "@/lib/constants";
import DashboardView from "@/modules/dashboard/DashboardView";
import type { User } from "@/types/auth";
import type { DashboardData } from "@/types/dashboard";

export const dynamic = "force-dynamic";

type BackendResponse<T> = {
  message?: string;
  data?: T;
};

class BackendRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendRequestError";
    this.status = status;
  }
}

async function fetchBackend<T>(path: string, token: string) {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const body = (await response.json().catch(() => null)) as
    | BackendResponse<T>
    | null;

  if (!response.ok) {
    throw new BackendRequestError(
      body?.message || "Failed to fetch dashboard data.",
      response.status
    );
  }

  if (!body || body.data === undefined) {
    throw new BackendRequestError("Backend response did not include data.", 500);
  }

  return body.data;
}

function isAuthError(error: unknown) {
  return (
    error instanceof BackendRequestError &&
    (error.status === 401 || error.status === 403)
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load dashboard data.";
}

export default async function DashboardPage() {
  const token = (await cookies()).get(TOKEN_KEY)?.value;

  if (!token) {
    redirect("/login");
  }

  let initialUser: User;

  try {
    initialUser = await fetchBackend<User>("/auth/me", token);
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }

    throw error;
  }

  let initialDashboard: DashboardData | null = null;
  let dashboardError: string | null = null;

  try {
    initialDashboard = await fetchBackend<DashboardData>("/dashboard", token);
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }

    dashboardError = getErrorMessage(error);
  }

  return (
    <DashboardView
      hasServerToken
      initialDashboard={initialDashboard}
      initialUser={initialUser}
      dashboardError={dashboardError}
    />
  );
}
  