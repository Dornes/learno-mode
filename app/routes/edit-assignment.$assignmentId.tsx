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
import TaskForm from "~/components/custom/form/task-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { assignmentLoader } from "~/services/assignment-loader";
import { editAssignmentAction } from "~/services/edit-assignment-action";
import { Task } from "~/types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import BackButton from "~/components/custom/back-button";
import ChatLogs from "~/components/custom/admin/chat-logs";

export const loader: LoaderFunction = assignmentLoader;
export const action: ActionFunction = editAssignmentAction;

const EditAssignment = () => {
  const { assignment, tasks } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const navigate = useNavigate();

  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    message: string
  ) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  //toast generation
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
      <BackButton to="/admin" />
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
          <div className="space-x-2">
            <Button type="submit" name="action" value="editAssignment">
              Update assignment
            </Button>
            <Button
              type="submit"
              name="action"
              value="deleteAssignment"
              className="bg-red-500 hover:bg-red-600"
              onClick={(event) =>
                handleConfirm(
                  event,
                  "Are you sure you want to delete this assignment? This will delete all associated tasks. ;O"
                )
              }
            >
              Delete assignment
            </Button>
          </div>
        </div>
      </Form>
      <Tabs defaultValue="tasks">
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="tasks">
            Tasks
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="chat-logs">
            Chat logs
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

          <Accordion type="single" collapsible className="w-full">
            {tasks.map((task: Task) => {
              return (
                <AccordionItem key={task.id} value={task.title}>
                  <AccordionTrigger className="px-2">
                    {task.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <TaskForm task={task} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Form method="post" className="mt-8 space-y-2 pb-8">
            <h4>Create new task</h4>
            <div className="flex flex-row space-x-2">
              <Input
                name="taskTitle"
                placeholder="Task title"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
              <Button type="submit" name="action" value="createTask">
                Create task
              </Button>
            </div>
          </Form>
        </TabsContent>
        <TabsContent value="chat-logs" className="mt-4">
          <ChatLogs />{" "}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditAssignment;
