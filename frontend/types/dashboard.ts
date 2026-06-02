export type Activity = {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  metadata?: any;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
  };
};

export type DashboardData = {
  completedTasks: number;
  activeProjects: number;
  weeklyWorkedHours: number;
  recentActivity: Activity[];
};