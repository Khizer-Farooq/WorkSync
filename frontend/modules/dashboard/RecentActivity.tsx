import type { Activity } from "@/types/dashboard";

type Props = {
  activities: Activity[];
};

function formatAction(action: string) {
  return action.replaceAll("_", " ").toLowerCase();
}

export default function RecentActivityList({ activities }: Props) {
  if (!activities.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <p className="mt-3 text-sm text-gray-500">No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

      <div className="mt-4 space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex flex-col gap-1 rounded-xl border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium capitalize text-gray-900">
                {formatAction(activity.action)}
              </p>

              <p className="text-xs text-gray-500">
                {activity.user?.name || "System"} · {activity.entityType}
              </p>
            </div>

            <p className="text-xs text-gray-400">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}