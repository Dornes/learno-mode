import { useLoaderData } from "@remix-run/react";
import BackButton from "~/components/custom/back-button";
import OpenAI from "openai";
import { Task } from "~/types/types";
import { LoaderFunction } from "@remix-run/node";
import { taskLoader } from "~/services/task-loader";
import { Button } from "~/components/ui/button";

interface TaskLoaderData {
  thread: OpenAI.Beta.Threads.Messages.Message[];
  task: Task;
}

export const loader: LoaderFunction = taskLoader;

export default function ThreadPage() {
  const { task, thread } = useLoaderData<TaskLoaderData>();

  const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleDownloadTxt = () => {
    const txtData = thread
      .map((message) => {
        // Safely get the first content block
        const firstBlock = message?.content?.[0];

        // Narrow the type: check if this block is a text block
        if (firstBlock?.type === "text") {
          // Now we can safely access firstBlock.text.value
          return `${message?.role === "user" ? "User:" : "AI:"} ${
            firstBlock.text.value
          }`;
        }

        // If it's not a text block (e.g., an image block), return something else or just an empty string
        return "";
      })
      .join("\n\n");
    downloadFile(txtData, `${task.title}_chatlog.txt`, "text/plain");
  };

  return (
    <div>
      <BackButton to={`/edit-assignment/${task.assignment_id}`} />
      <div className="mx-auto w-2/3">
        <h1 className="text-3xl font-bold my-4">Chat Logs for {task.title}</h1>
        <div className="mb-4">
          <Button onClick={handleDownloadTxt}>Download</Button>
        </div>
        {thread.map((message) => {
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
                {message?.content?.[0]?.type === "text"
                  ? message?.content?.[0]?.text.value
                  : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
