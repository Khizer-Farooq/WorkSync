import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
};

export default function StatCard({ title, value, icon: Icon }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{value}</h2>
        </div>

        <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}