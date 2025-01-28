import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EvaluationChat from "~/components/custom/evaluation-chat";
import { taskAction } from "~/services/task-action";
import { taskLoader } from "~/services/task-loader";

export const loader: LoaderFunction = taskLoader;
export const action: ActionFunction = taskAction;

export default function Evaluation() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col justify-center items-center mt-2">
      <h1 className="text-2xl">Evaluating {task.title}</h1>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono w-3/4">
        <code>{task.solution}</code>
      </pre>
      <EvaluationChat
        solution={task.solution}
        taskId={task.id}
        status={task.status}
      />
    </div>
  );
}
