import DataTable, { DataColumn } from "@/components/shared/DataTable";
import type { Activity } from "@/types/dashboard";

type Props = {
  activities: Activity[];
};

function formatAction(action: string) {
  return action.replaceAll("_", " ").toLowerCase();
}

const metadataFields = [
  { keys: ["title"], label: "Title" },
  { keys: ["projectTitle"], label: "Project" },
  { keys: ["projectStatus"], label: "Project status" },
  { keys: ["taskStatus", "statusName"], label: "Task status" },
  { keys: ["dueDate"], label: "Due date" },
  { keys: ["assignedUserNames"], label: "Assigned users" },
  { keys: ["removedUserName"], label: "Removed user" },
  { keys: ["clockIn"], label: "Clock in" },
  { keys: ["clockOut"], label: "Clock out" },
  { keys: ["shiftType"], label: "Shift type" },
  { keys: ["totalHours"], label: "Total hours" },
];

function formatWords(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatMetadataValue(key: string, value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (key === "totalHours" && typeof value === "number") {
    return `${value} hours`;
  }

  if (["clockIn", "clockOut", "dueDate"].includes(key) && value) {
    return new Date(String(value)).toLocaleString();
  }

  if (["projectStatus", "taskStatus", "statusName", "shiftType"].includes(key)) {
    return formatWords(String(value));
  }

  return String(value);
}

function getActivityDetails(metadata: Activity["metadata"]) {
  if (!metadata) {
    return [];
  }

  return metadataFields
    .map((field) => {
      const key = field.keys.find((fieldKey) => {
        const value = metadata[fieldKey];
        if (Array.isArray(value)) {
          return value.length > 0;
        }

        return value !== undefined && value !== null && value !== "";
      });

      if (!key) {
        return null;
      }

      return {
        label: field.label,
        value: formatMetadataValue(key, metadata[key]),
      };
    })
    .filter((detail) => detail !== null);
}

const columns: DataColumn<Activity>[] = [
  {
    header: "Activity",
    render: (activity) => (
      <div>
        <p className="font-medium capitalize text-gray-900">
          {formatAction(activity.action)}
        </p>
        <p className="text-xs text-gray-500">
          {activity.entityType}
          {activity.entityId ? ` #${activity.entityId}` : ""}
        </p>
      </div>
    ),
  },
  {
    header: "User",
    render: (activity) => (
      <div>
        <p className="font-medium text-gray-900">
          {activity.user?.name || "System"}
        </p>
        {activity.user?.email && (
          <p className="text-xs text-gray-500">{activity.user.email}</p>
        )}
      </div>
    ),
  },
  {
    header: "Details",
    render: (activity) => {
      const details = getActivityDetails(activity.metadata);

      if (!details.length) {
        return <span className="text-xs text-gray-400">No extra details</span>;
      }

      return (
        <div className="space-y-1">
          {details.map((detail) => (
            <p key={detail.label} className="text-xs text-gray-600">
              <span className="font-medium">{detail.label}:</span>{" "}
              {detail.value}
            </p>
          ))}
        </div>
      );
    },
  },
  {
    header: "Time",
    className: "text-right",
    render: (activity) => new Date(activity.createdAt).toLocaleString(),
  },
];

export default function RecentActivityList({ activities }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <p className="text-sm text-gray-500">
          Latest actions from tasks, projects, and shifts.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">No recent activity found.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={activities}
          rowKey={(activity) => activity.id}
        />
      )}
    </section>
  );
}
