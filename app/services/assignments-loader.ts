import { LoaderFunction } from "@remix-run/node";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { Assignment } from "~/types/types";

export const assignmentsLoader: LoaderFunction = async () => {
  const { data, error } = await supabase.rpc(
    "get_all_assignments_with_task_info"
  );
  if (error) {
    throw new Error(`Error fetching assignments: ${error.message}`);
  }
  const sortedAssignments = Array.isArray(data)
    ? data.sort((a: Assignment, b: Assignment) =>
        a.title.localeCompare(b.title)
      )
    : [];
  return { data: sortedAssignments as Assignment[] };
};
