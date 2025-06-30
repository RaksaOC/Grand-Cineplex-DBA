export interface RecentActivity {
  usename: string;
  ip: string;
  status: string;
  backend_start: Date;
}

export interface DashboardData {
  numOfUsers: number;
  numOfRoles: number;
  databaseSize: number;
  totalBackups: number;
  numOfTables: number;
  numOfViews: number;
  numOfIndexes: number;
  numOfTriggers: number;
  recentActivities: RecentActivity[];
}
