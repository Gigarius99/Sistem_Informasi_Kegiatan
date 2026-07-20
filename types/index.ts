// Global TypeScript types for Sistem Informasi Daftar Kegiatan Kantor

export type Role = "ADMIN_APLIKASI" | "ADMIN_KEGIATAN" | "PIMPINAN";
export type ActionType =
  | "CREATE_ACTIVITY"
  | "UPDATE_ACTIVITY"
  | "DELETE_ACTIVITY";

// ============================================================
// User Types
// ============================================================
export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  name: string;
  username: string;
  role: Role;
}

// ============================================================
// Activity Types
// ============================================================
export interface Activity {
  id: string;
  title: string;
  activityDate: Date;
  location: string;
  transitLocation: string | null;
  dresscode: string;
  invitationTime: string;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface CreateActivityInput {
  title: string;
  activityDate: string; // ISO date string from client
  location: string;
  transitLocation?: string;
  dresscode: string;
  invitationTime: string;
  description?: string;
}

export interface UpdateActivityInput extends CreateActivityInput {
  id: string;
}

// ============================================================
// Activity Log Types
// ============================================================
export interface ActivityLog {
  id: string;
  userId: string;
  activityId: string;
  action: ActionType;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    username: string;
    role: Role;
  };
  activity?: {
    id: string;
    title: string;
  };
}

// ============================================================
// API Response Types
// ============================================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Filter Types
// ============================================================
export interface ActivityFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================================
// Dashboard Stats Types
// ============================================================
export interface DashboardStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

// ============================================================
// Export Types
// ============================================================
export interface ExportFilter {
  startDate: string;
  endDate: string;
}
