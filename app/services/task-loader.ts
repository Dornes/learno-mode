import { LoaderFunction } from "@remix-run/node";
import OpenAI from "openai";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { Task } from "~/types/types";

export const fetchThread = async (taskId: number, isEvaluation: boolean) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { data, error } = await supabase
    .from("tasks")
    .select("thread_id, assistant_thread")
    .eq("id", taskId)
    .single();

  if (error) {
    throw new Error(`Error fetching thread ID: ${error.message}`);
  }

  const threadId = isEvaluation ? data?.thread_id : data?.assistant_thread;

  try {
    if (!threadId) {
      return null;
    }
    const thread = await openai.beta.threads.messages.list(threadId);
    const threadData = thread.data.reverse();
    return Response.json(threadData, { status: 200 });
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

  const [taskResult, evaluationThread, assistantThread] = await Promise.all([
    supabase.from("tasks").select("*").eq("id", taskId).single(),
    fetchThread(taskId, true),
    fetchThread(taskId, false),
  ]);

  const evaluationThreadData = evaluationThread
    ? await evaluationThread.json()
    : null;
  const assistantThreadData = assistantThread
    ? await assistantThread.json()
    : null;

  if (taskResult.error) {
    throw new Error(`Error fetching task: ${taskResult.error.message}`);
  }

  return {
    task: taskResult.data as Task,
    evaluationThread: evaluationThreadData ?? [],
    assistantThread: assistantThreadData ?? [],
  };
};
