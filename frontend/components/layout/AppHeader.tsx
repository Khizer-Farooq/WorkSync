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
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-bold text-slate-900">WorkSync</h1>
          <p className="hidden sm:block text-xs text-slate-600">
            Team Task & Shift Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-slate-600">{user?.role || "Role"}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white shadow-sm hover:bg-slate-900 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}