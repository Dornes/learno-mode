import { useLoaderData } from "@remix-run/react";
import BackButton from "~/components/custom/back-button";
import OpenAI from "openai";
import { Task } from "~/types/types";
import { LoaderFunction } from "@remix-run/node";
import { taskLoader } from "~/services/task-loader";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python.min.js";
import "prismjs/themes/prism.css";

interface TaskLoaderData {
  evaluationThread: OpenAI.Beta.Threads.Messages.Message[];
  task: Task;
}

export const loader: LoaderFunction = taskLoader;

export default function ThreadPage() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const { task, evaluationThread } = useLoaderData<TaskLoaderData>();

  const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleDownloadTxt = () => {
    const txtData = evaluationThread
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
      <div className="flex flex-col justify-center items-center mt-2 space-y-3">
        <h1 className="text-3xl font-bold my-4">Chat Logs for {task.title}</h1>
        <div className="mb-4">
          <Button onClick={handleDownloadTxt}>Download</Button>
        </div>
        <pre className="p-4 overflow-x-auto overflow-y-auto text-sm font-mono w-3/4 max-h-56 bg-gray-100 language-python">
          <code className="bg-gray-100 rounded-md">{task.solution}</code>
        </pre>
        <div className="mx-auto w-3/4">
          {evaluationThread.map((message, index) => {
            // For safety, get the first block
            const firstBlock = message?.content[0];

            // If there's no first block or it's not a text block, just skip/return null
            if (!firstBlock || firstBlock.type !== "text") {
              return null;
            }
            const isInitialSolution =
              index === 0 && firstBlock.text.value === task.solution;

            if (isInitialSolution) {
              return null;
            }

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
    </div>
  );
}
