import { Link } from "@remix-run/react";
import { House } from "lucide-react";
import { Assignment, Task } from "~/types/types";
import { Separator } from "../ui/separator";

interface SidebarProps {
  assignment: Assignment;
  tasks: Task[];
}

const Sidebar = ({ tasks, assignment }: SidebarProps) => {
  return (
    <div className="w-1/5 bg-gray-100 border-r border-gray-300 p-4">
      <h2 className="text-2xl font-bold mb-1">{assignment.title}</h2>
      <p className="font-extralight text-sm">{assignment.description}</p>
      <Separator className="my-4 h-[2px]" />
      <nav className="space-y-4">
        {tasks.map((task) => (
          <Link
            key={task.id}
            to={`task/${task.id}`}
            className="block text-xl text-gray-700 hover:text-blue-500"
          >
            {task.title}
          </Link>
        ))}
      </nav>
      {tasks.length === 0 && <p className="font-light">No tasks found</p>}
      <div className="fixed bottom-0 left-0 w-1/5 p-4">
        <Separator className="my-4 h-[2px]" />
        <Link
          to={`/`}
          className="flex flex-row text-xl text-gray-700 hover:text-blue-500"
        >
          <House className="mr-2" />
          Home
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
