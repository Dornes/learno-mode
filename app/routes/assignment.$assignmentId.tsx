import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Sidebar from "~/components/custom/sidebar";
import { assignmentLoader } from "~/services/assignment-loader";

export const loader: LoaderFunction = assignmentLoader;

export default function Assignment() {
  const { assignment, tasks } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <Sidebar assignmentTitle={assignment.title} tasks={tasks} />

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
