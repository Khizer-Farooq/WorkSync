"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard,FolderKanban,CheckSquare,Clock,UserPlus,} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AppSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "EMPLOYEE"],
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderKanban,
      roles: ["ADMIN", "EMPLOYEE"],
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      roles: ["ADMIN", "EMPLOYEE"],
    },
    {
      label: "Shifts",
      href: "/shifts",
      icon: Clock,
      roles: ["ADMIN", "EMPLOYEE"],
    },
    {
      label: "Register Employee",
      href: "/register",
      icon: UserPlus,
      roles: ["ADMIN"],
    },
  ];

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 h-auto w-64 bg-gray-950 text-white
          transition-transform duration-200 lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center border-b border-white/10 px-5">
          <h2 className="text-xl font-bold">WorkSync</h2>
        </div>

        <nav className="space-y-2 p-4">
          {allowedMenuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm
                  ${
                    active
                      ? "bg-white text-gray-950"
                      : "text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}