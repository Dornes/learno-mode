import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TitleInput } from "~/components/custom/form/title-input";
import TaskForm from "~/components/custom/task-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { assignmentLoader } from "~/services/assignment-loader";
import { editAssignmentAction } from "~/services/edit-assignment-action";
import { Task } from "~/types/types";

export const loader: LoaderFunction = assignmentLoader;
export const action: ActionFunction = editAssignmentAction;

const EditAssignment = () => {
  const { assignment, tasks } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      toast.info(message, {
        //setting an id prevents duplicate toasts
        toastId: message,
      });
      navigate("./");
      if (message === "Task successfully created.") {
        setInputValue("");
      }
    }
  }, [message, navigate]);

  const [inputValue, setInputValue] = useState("");

  return (
    <div className="w-4/5 md:w-3/5 mx-auto mt-10">
      <Form method="post">
        <div className="mb-10 space-y-4">
          <TitleInput
            name="assignmentTitle"
            maxLength={64}
            placeholder="Assignment title"
            defaultValue={assignment?.title || "Untitled assignment"}
          />
          <div className="space-y-1">
            <p className="text-gray-500 text-sm">Assignment description</p>
            <Input
              name="assignmentDescription"
              placeholder="Assignment description"
              defaultValue={assignment?.description || ""}
            />
          </div>
          <Button type="submit" name="action" value="editAssignment">
            Update assignment
          </Button>
        </div>
      </Form>
      <Tabs defaultValue="tasks">
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="tasks">
            Tasks
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="configuration">
            Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl">Tasks</h1>
              <p>
                These are the tasks associated with this assignment. Include
                test code so the student can confirm their code is correct
                before proceeding to evaluation.
              </p>
            </div>
            <Separator className="border-t-2" />
          </div>

          {tasks.map((task: Task) => {
            return (
              <div key={task.id}>
                <TaskForm task={task} />
                <Separator className="border-t-2" />
              </div>
            );
          })}

          <Form method="post" className="mt-12 space-y-2 pb-8">
            <h4>Create new task</h4>
            <div className="flex flex-row space-x-2">
              <Input
                name="taskTitle"
                placeholder="Task title"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="submit" name="action" value="createTask">
                Create task
              </Button>
            </div>
          </Form>
        </TabsContent>
        <TabsContent value="configuration"></TabsContent>
      </Tabs>
    </div>
  );
};

export default EditAssignment;
