import { ActionFunction, redirect } from "@remix-run/node";
import { supabaseClient as supabase } from "~/auth/supabase.server";
import { OpenAI } from "openai";

const saveCodeSubmission = async (
  formData: FormData,
  taskId: number,
  evaluate: boolean
) => {
  const code = formData.get("code") as string;
  if (!code) {
    return new Response("No message provided", { status: 400 });
  }
  try {
    await supabase
      .from("tasks")
      .update({
        solution: code,
      })
      .eq("id", taskId);
    return evaluate ? redirect(`/evaluation/${taskId}`) : null;
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};

const generateAiResponse = async (formData: FormData) => {
  const userMessage = formData.get("message") as string;
  const threadIdInput = formData.get("threadId") as string;

  if (!userMessage) {
    return new Response("No message provided", { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    let threadId = threadIdInput ?? "";

    if (threadId == "") {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });

    let run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID || "",
    });

    const statuses = ["requires_action", "in_progress", "cancelling", "queued"];

    while (statuses.includes(run.status)) {
      run = await openai.beta.threads.runs.retrieve(threadId, run.id);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      const messagesData = messages.data.reverse();
      return Response.json({ messagesData, threadId }, { status: 200 });
    } else {
      return Response.json({ error: "AI response failed" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};

const approveTask = async (formData: FormData) => {
  const taskId = Number(formData.get("taskId"));
  const feedback = formData.get("feedback") as string;
  try {
    await supabase
      .from("tasks")
      .update({
        status: "APPROVED",
        ai_feedback: feedback,
      })
      .eq("id", taskId);
    return redirect(`/evaluation/${taskId}`);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};

const rejectTask = async (formData: FormData) => {
  const taskId = Number(formData.get("taskId"));
  const feedback = formData.get("feedback") as string;
  try {
    await supabase
      .from("tasks")
      .update({
        status: "NOT_APPROVED",
        ai_feedback: feedback,
      })
      .eq("id", taskId);
    return redirect(`/evaluation/${taskId}`);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};

export const taskAction: ActionFunction = async ({ request, params }) => {
  const taskId = Number(params.taskId);
  if (isNaN(taskId)) {
    throw new Error("Invalid task ID");
  }
  const formData = await request.formData();
  const actionType = formData.get("action") as string;
  if (actionType === "evaluate") {
    return saveCodeSubmission(formData, taskId, true);
  } else if (actionType === "save") {
    return saveCodeSubmission(formData, taskId, false);
  } else if (actionType === "help-chat") {
    return generateAiResponse(formData);
  } else if (actionType === "approve-task") {
    return approveTask(formData);
  } else if (actionType === "reject-task") {
    return rejectTask(formData);
  }
  return new Response("Invalid action", { status: 400 });
};
