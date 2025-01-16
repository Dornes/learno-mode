import { LoaderFunction, redirect } from "@remix-run/node";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { Assignment, Task } from "~/types/types";

const fetchAssignment = async (assignmentId: number) => {
  const { data, error } = await supabase.rpc(
    "get_single_assignment_with_task_info",
    { assignment_id_parameter: assignmentId }
  );
  if (error) {
    throw new Error(`Error fetching assignment: ${error.message}`);
  }
  return data as Assignment;
};

const fetchTasks = async (assignmentId: number) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("assignment_id", assignmentId);
  if (error) {
    throw new Error(`Error fetching tasks: ${error.message}`);
  }
  const sortedTasks = Array.isArray(data)
    ? data.sort((a: Task, b: Task) => a.title.localeCompare(b.title))
    : [];

  return sortedTasks as Task[];
};

export const assignmentLoader: LoaderFunction = async (args) => {
  const params = args.params;
  const assignmentId = Number(params.assignmentId);
  if (isNaN(assignmentId)) {
    throw new Error("Invalid assignment ID");
  }

  const assignment = await fetchAssignment(assignmentId);
  const tasks = await fetchTasks(assignmentId);

  const request = args.request;
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === `/assignment/${assignmentId}` && tasks.length > 0) {
    return redirect(`/assignment/${assignmentId}/task/${tasks[0].id}`);
  }

  return { assignment, tasks };
};
