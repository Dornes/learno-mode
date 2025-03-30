import { LoaderFunction } from "@remix-run/node";
import OpenAI from "openai";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { Task } from "~/types/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const fetchThread = async (taskId: number, isEvaluation: boolean) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("thread_id, assistant_thread")
    .eq("id", taskId)
    .single();
  if (error) throw new Error(`Error fetching thread ID: ${error.message}`);

  const threadId = isEvaluation ? data?.thread_id : data?.assistant_thread;
  if (!threadId) return null;
  try {
    const { data: messages } = await openai.beta.threads.messages.list(
      threadId
    );
    return messages.reverse();
  } catch (error) {
    console.error(error);
    throw new Response("Failed to fetch thread", { status: 500 });
  }
};

export const taskLoader: LoaderFunction = async (args) => {
  const params = args.params;
  const taskId = Number(params.taskId);
  if (isNaN(taskId)) {
    throw new Error("Invalid task ID");
  }

  const [{ data: task, error }, evaluation, assistant] = await Promise.all([
    supabase.from("tasks").select("*").eq("id", taskId).single(),
    fetchThread(taskId, true),
    fetchThread(taskId, false),
  ]);
  if (error) throw new Error(`Error fetching task: ${error.message}`);

  const isControlGroup = await supabase
    .from("assignments")
    .select("is_control_group")
    .eq("id", task.assignment_id)
    .single();

  return {
    task: task as Task,
    isControlGroup: isControlGroup,
    evaluationThread: evaluation ?? [],
    assistantThread: assistant ?? [],
  };
};
