import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Sidebar from "~/components/custom/sidebar";
import { assignmentLoader } from "~/services/assignment-loader";
import { taskAction } from "~/services/task-action";

export const loader: LoaderFunction = assignmentLoader;
export const action: ActionFunction = taskAction;

export default function Assignment() {
  const { assignment, tasks } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <Sidebar assignment={assignment} tasks={tasks} />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
