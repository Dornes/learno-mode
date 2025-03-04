import { Form } from "@remix-run/react";
import { Input } from "../../ui/input";
import { Task } from "~/types/types";
import { Button } from "../../ui/button";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import { useState } from "react";

interface TaskFormProps {
  task: Task;
}

const TaskForm = ({ task }: TaskFormProps) => {
  const [codeInput, setCodeInput] = useState<string>(task?.test_code || "");
  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    message: string
  ) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };
  const isClient = typeof window !== "undefined";

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
        {isClient && (
          <div className="overflow-auto h-[300px]">
            <Editor
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.python, "python")
              }
              onValueChange={(code) => setCodeInput(code)}
              value={codeInput}
              name="testCode"
              padding={10}
              className="bg-gray-100 rounded-md"
            />
          </div>
        )}
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
              handleConfirm(event, "Are you sure you want to delete this task?")
            }
          >
            Delete task
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TaskForm;
