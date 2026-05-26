import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardView from "@/modules/dashboard/DashboardView";
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to WorkSync dashboard.</p>
      </div>
      <DashboardView />
    </DashboardLayout>
  );
}