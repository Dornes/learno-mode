import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/edit-assignment.$assignmentId";
import { Task } from "~/types/types";
const ChatLogs = () => {
  const { tasks } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task: Task) =>
        task.thread_id ? (
          <Link
            key={task.id}
            to={`/thread/${task.thread_id}`}
            className="block p-4 border rounded shadow hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold">Chat log for {task.title}</h3>
          </Link>
        ) : null
      )}
    </div>
  );
};

export default ChatLogs;
