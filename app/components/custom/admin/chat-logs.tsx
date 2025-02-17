import { Link, useLoaderData } from "@remix-run/react";
import { Separator } from "~/components/ui/separator";
import { loader } from "~/routes/edit-assignment.$assignmentId";
import { Task } from "~/types/types";
const ChatLogs = () => {
  const { tasks } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-2">
      <div className="space-y-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-xl">Chat logs</h1>
          <p>Only logs for completed evaluations will appear in this list.</p>
        </div>
        <Separator className="border-t-2" />
      </div>
      {tasks.map((task: Task) =>
        task.thread_id ? (
          <Link
            key={task.id}
            to={`/thread/${task.id}`}
            className="block p-4 border rounded shadow hover:bg-gray-100"
          >
            <h3 className="text-lg ">Chat log for {task.title} evaluation</h3>
          </Link>
        ) : null
      )}
    </div>
  );
};

export default ChatLogs;
