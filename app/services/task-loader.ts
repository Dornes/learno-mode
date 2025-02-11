import { LoaderFunction } from "@remix-run/node";
import OpenAI from "openai";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { Task } from "~/types/types";

export const fetchThread = async (taskId: number) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { data, error } = await supabase
    .from("tasks")
    .select("thread_id")
    .eq("id", taskId)
    .single();

  if (error) {
    throw new Error(`Error fetching thread ID: ${error.message}`);
  }

  const threadId = data?.thread_id;

  try {
    if (!threadId) {
      throw new Error("ThreadID required");
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
  const threadResponse = await fetchThread(taskId);
  const threadData = await threadResponse.json();
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
  return {
    task: data as Task,
    thread: threadData as OpenAI.Beta.Threads.Messages.Message[],
  };
};
