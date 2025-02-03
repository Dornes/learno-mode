import { Form } from "@remix-run/react";
import { useState } from "react";
import { Input } from "../../ui/input";
import { Task } from "~/types/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { Button } from "../../ui/button";

interface TaskFormProps {
  task: Task;
}

const TaskForm = ({ task }: TaskFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    message: string
  ) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  return (
    <div className="my-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between space-x-4 mb-2 hover:bg-gray-100 hover:cursor-pointer p-2 rounded-sm">
            <h4 className="">{task.title}</h4>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}

            <span className="sr-only">Toggle</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-gray-100 p-2">
          <Form method="post" className="space-y-2">
            <p className="text-gray-500 text-sm">Task title</p>
            <Input
              name="taskTitle"
              placeholder="Task title"
              defaultValue={task?.title || ""}
            />
            <p className="text-gray-500 text-sm">Task description</p>
            <Input
              name="taskDescription"
              placeholder="Task description"
              defaultValue={task?.description || ""}
            />
            <p className="text-gray-500 text-sm">Test code</p>
            <Input
              name="testCode"
              placeholder="Test code"
              defaultValue={task?.test_code || ""}
            />
            <input type="hidden" value={task.id} name="taskId" />
            <div className="space-x-2">
              <Button type="submit" name="action" value="editTask">
                Update task
              </Button>
              <Button
                type="submit"
                name="action"
                value="deleteTask"
                className="bg-red-500 hover:bg-red-600"
                onClick={(event) =>
                  handleConfirm(
                    event,
                    "Are you sure you want to delete this task?"
                  )
                }
              >
                Delete task
              </Button>
            </div>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TaskForm;
