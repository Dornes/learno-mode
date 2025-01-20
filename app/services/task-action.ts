import { ActionFunction } from "@remix-run/node";
import { OpenAI } from "openai";

const generateAiResponse = async (formData: FormData) => {
  const userMessage = formData.get("message") as string;

  if (!userMessage) {
    return new Response("No message provided", { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID || "",
    });

    const statuses = ["requires_action", "in_progress", "cancelling", "queued"];

    while (statuses.includes(run.status)) {
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(run.status);

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const messagesData = messages.data;
      messagesData.forEach((message) => {
        console.log(message.content);
      });
      return Response.json(messagesData, { status: 200 });
    } else {
      return Response.json({ error: "AI response failed" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};

export const taskAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("action") as string;
  if (actionType === "help-chat") {
    return generateAiResponse(formData);
  }
  return new Response("Invalid action", { status: 400 });
};
