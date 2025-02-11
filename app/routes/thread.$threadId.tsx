import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import OpenAI from "openai";
import BackButton from "~/components/custom/back-button";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const loader: LoaderFunction = async (args) => {
  const params = args.params;
  const threadId = params.threadId;

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

export default function ThreadPage() {
  const thread = useLoaderData<OpenAI.Beta.Threads.Messages.Message[]>();

  return (
    <div>
      <BackButton to="/admin" />
      <div className="mx-auto w-2/3">
        <h1 className="text-3xl font-bold mb-4">Chat Logs</h1>
        {thread.map((message, index) => {
          return (
            <div
              key={message?.id}
              className={`mb-4 pr-3 ${
                message?.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message?.role === "user"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-200 text-black`
                }`}
              >
                {message?.content[0].text.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
