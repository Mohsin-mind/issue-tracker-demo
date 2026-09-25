export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type IssueType = 'STORY' | 'BUG' | 'TASK';
export type EpicStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Epic {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  color: string;
  status: EpicStatus;
  issues_count?: number;
  completed_count?: number;
  progress_percent?: number;
  issues?: Issue[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_color: string;
  created_at?: string;
  updated_at?: string;
}

export interface Label {
  id: string;
  project_id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  body: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  project_id: string;
  column_id: string;
  issue_number: number;
  issue_key?: string; // e.g. WOLF-1
  title: string;
  description?: string;
  type: IssueType;
  priority: Priority;
  assignee_id?: string;
  reporter_id: string;
  epic_id?: string | null;
  epic?: Epic | null;
  position: number;
  due_date?: string;
  assignee?: User;
  reporter?: User;
  column?: BoardColumn;
  project?: Project;
  labels?: Label[];
  comments?: Comment[];
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BoardColumn {
  id: string;
  project_id: string;
  name: string;
  position: number;
  issues?: Issue[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  members?: User[];
  columns?: BoardColumn[];
  epics?: Epic[];
  issues_count?: number;
  members_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}
