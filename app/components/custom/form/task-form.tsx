import { Form } from "@remix-run/react";
import { Input } from "../../ui/input";
import { Task } from "~/types/types";
import { Button } from "../../ui/button";

interface TaskFormProps {
  task: Task;
}

const TaskForm = ({ task }: TaskFormProps) => {
  return (
    <div className="bg-gray-50 p-2">
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
        <Button type="submit" name="action" value="editTask">
          Update task
        </Button>
      </Form>
    </div>
  );
};

export default TaskForm;
