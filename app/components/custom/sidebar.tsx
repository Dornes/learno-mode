import { Link } from "@remix-run/react";
import { Task } from "~/types/types";

interface SidebarProps {
  assignmentTitle: string;
  tasks: Task[];
}

const Sidebar = ({ tasks, assignmentTitle }: SidebarProps) => {
  console.log(assignmentTitle);

  return (
    <div className="w-1/5 bg-gray-100 border-r border-gray-300 p-4">
      <h2 className="text-lg font-bold mb-4">{assignmentTitle}</h2>
      <nav className="space-y-2">
        {tasks.map((task) => (
          <Link
            key={task.id}
            to={`task/${task.id}`}
            className="block text-gray-700 hover:text-blue-500"
          >
            {task.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
