import { ActionFunction } from "@remix-run/node";
import { OpenAI } from "openai";

export const openaiAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
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

    return Response.json({ response: response.choices[0].message.content });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};
