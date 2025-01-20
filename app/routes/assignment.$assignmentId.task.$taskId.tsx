import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import ChatButton from "~/components/custom/chat-button";
import PythonCodeRunner from "~/components/custom/python-code-runner";
import { taskAction } from "~/services/task-action";
import { taskLoader } from "~/services/task-loader";

export const loader: LoaderFunction = taskLoader;
export const action: ActionFunction = taskAction;

export default function Task() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="mt-4">{task.description}</p>
      <PythonCodeRunner />
      <ChatButton />
    </div>
  );
}
