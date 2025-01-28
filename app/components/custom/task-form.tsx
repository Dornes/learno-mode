import { Form } from "@remix-run/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Task } from "~/types/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";

interface TaskFormProps {
  task: Task;
}

const TaskForm = ({ task }: TaskFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="my-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
        <div className="flex items-center justify-between space-x-4 mb-2">
          <h4 className="">{task.title}</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}

              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pb-12">
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
              placeholder="Task title"
              defaultValue={task?.description || ""}
            />
            <p className="text-gray-500 text-sm">Test code</p>
            <Input
              name="test_code"
              placeholder="Task title"
              defaultValue={task?.test_code || ""}
            />
            <Button type="submit">Update task</Button>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TaskForm;
