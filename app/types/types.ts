export type Assignment = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  total_tasks: number;
  approved_tasks: number;
  all_tasks_approved: boolean;
};

export type Task = {
  id: number;
  created_at: string;
  title: string;
  status: STATUS;
  description: string | null;
  test_code: string | null;
  solution: string | null;
  assignment_id: number;
};

export enum STATUS {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
}
