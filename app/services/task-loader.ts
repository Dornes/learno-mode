import { LoaderFunction } from "@remix-run/node";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { Task } from "~/types/types";

export const taskLoader: LoaderFunction = async (args) => {
  const params = args.params;
  const taskId = Number(params.taskId);
  if (isNaN(taskId)) {
    throw new Error("Invalid task ID");
  }
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) {
    throw new Error(`Error fetching task: ${error.message}`);
  }
  return { task: data as Task };
};
