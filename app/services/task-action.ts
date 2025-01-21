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

  if (!userMessage) {
    return new Response("No message provided", { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    const message = response.choices[0].message.content;

    return Response.json(message);
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
  }
  return new Response("Invalid action", { status: 400 });
};
