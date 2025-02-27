import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ChatButton from "~/components/custom/chat-button";
import PythonCodeRunner from "~/components/custom/python-code-runner";
import { taskAction } from "~/services/task-action";
import { taskLoader } from "~/services/task-loader";

export const loader: LoaderFunction = taskLoader;
export const action: ActionFunction = taskAction;

export default function Task() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-4xl font-bold">{task.title}</h1>
      <p className="my-4">{task.description}</p>
      <PythonCodeRunner solution={task.solution} test_code={task.test_code} />
      <ChatButton />
    </>
  );
}
