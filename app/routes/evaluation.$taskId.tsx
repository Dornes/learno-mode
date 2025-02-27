import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Prism from "prismjs";
import "prismjs/components/prism-python.min.js";
import "prismjs/themes/prism.css";
import { useEffect } from "react";
import EvaluationChat from "~/components/custom/evaluation-chat";
import { taskAction } from "~/services/task-action";
import { taskLoader } from "~/services/task-loader";

export const loader: LoaderFunction = taskLoader;
export const action: ActionFunction = taskAction;

export default function Evaluation() {
  const { task } = useLoaderData<typeof loader>();

  // Applying the syntax highlighting
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-2 space-y-3">
      <h1 className="text-3xl font-semibold p-5">Evaluating {task.title}</h1>
      <pre className="p-4 overflow-x-auto overflow-y-auto text-sm font-mono w-3/4 max-h-48 bg-gray-100 language-python">
        <code className="bg-gray-100 rounded-md">{task.solution}</code>
      </pre>
      <EvaluationChat
        solution={task.solution}
        taskId={task.id}
        status={task.status}
        feedback={task.ai_feedback}
      />
    </div>
  );
}
