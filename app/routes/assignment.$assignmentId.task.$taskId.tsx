import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import ChatButton from "~/components/custom/chat-button";
import PythonCodeRunner from "../components/custom/python-code-runner";
import { taskAction } from "../services/task-action";
import { taskLoader } from "../services/task-loader";
import OpenAI from "openai";
import { Task } from "~/types/types";

interface TaskLoaderData {
  assistantThread: OpenAI.Beta.Threads.Messages.Message[];
  task: Task;
}

export const loader: LoaderFunction = taskLoader;
export const action: ActionFunction = taskAction;

export default function TaskPage() {
  const { task, assistantThread } = useLoaderData<TaskLoaderData>();

  return (
    <>
      <h1 className="text-4xl font-bold">{task.title}</h1>
      <div className="text-sm">
        <ReactMarkdown>{task.description}</ReactMarkdown>
      </div>
      <PythonCodeRunner
        solution={task.solution ?? ""}
        test_code={task.test_code!}
      />
      <ChatButton
        taskDescription={task.description!}
        threadId={task.assistant_thread ?? undefined}
        thread={assistantThread}
      />
    </>
  );
}
