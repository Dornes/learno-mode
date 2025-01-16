import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ChatButton from "~/components/custom/chat-button";
import PythonCodeRunner from "~/components/custom/python-code-runner";
import { taskLoader } from "~/services/task-loader";

export const loader: LoaderFunction = taskLoader;

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
