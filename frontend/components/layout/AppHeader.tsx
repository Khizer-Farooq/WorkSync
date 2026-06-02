"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import type { RootState } from "@/redux/store";

type Props = {
  onMenuClick: () => void;
};

export default function AppHeader({ onMenuClick }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  function handleLogout() {
    dispatch(logout());
    router.push("/login");
  }

  return (
    <header className="h-16 bg-white border-b px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg border p-2"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-bold text-gray-900">WorkSync</h1>
          <p className="hidden sm:block text-xs text-gray-500">
            Team Task & Shift Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">{user?.role || "Role"}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}