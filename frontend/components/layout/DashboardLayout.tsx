"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";

import { TOKEN_KEY } from "@/lib/constants";
import { setUser } from "@/redux/features/authSlice";
import { useGetMeQuery } from "@/redux/services/authApi";
import type { RootState } from "@/redux/store";
import type { User } from "@/types/auth";

export default function DashboardLayout({
  children,
  hasServerToken = false,
  initialUser = null,
}: {
  children: React.ReactNode;
  hasServerToken?: boolean;
  initialUser?: User | null;
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = Cookies.get(TOKEN_KEY);
  const user = useSelector((state: RootState) => state.auth.user);
  const hasToken = Boolean(token || hasServerToken);
  const displayUser = user || initialUser;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  useEffect(() => {
    if (initialUser && !user) {
      dispatch(setUser(initialUser));
    }
  }, [dispatch, initialUser, user]);

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (!hasToken || (!displayUser && isLoading) || !displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AppSidebar
        initialUser={displayUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader
          initialUser={displayUser}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
