import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TitleInput } from "~/components/custom/form/title-input";
import TaskForm from "~/components/custom/task-form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { assignmentLoader } from "~/services/assignment-loader";
import { Task } from "~/types/types";

export const loader: LoaderFunction = assignmentLoader;

const EditAssignment = () => {
  const { assignment, tasks } = useLoaderData<typeof loader>();

  return (
    <div className="w-4/5 md:w-3/5 mx-auto mt-10">
      <div className="mb-4 space-y-4">
        <TitleInput
          name="assignmentTitle"
          maxLength={64}
          placeholder="Assignment title"
          defaultValue={assignment?.title || "Untitled assignment"}
        />
        <Separator />
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Assignment description</p>
          <Input
            name="assignmentDescription"
            placeholder="Assignment description"
            defaultValue={assignment?.description || ""}
          />
        </div>
      </div>
      <Tabs defaultValue="tasks">
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="tasks">
            Tasks
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="configuration">
            Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <h1 className="text-xl">Tasks</h1>
          <p>
            These are the tasks associated with this assignment. Include test
            code so the student can confirm their code is correct before
            proceeding to evaluation.
          </p>
          {tasks.map((task: Task) => {
            return (
              <div key={task.id}>
                <TaskForm task={task} />
                <Separator />
              </div>
            );
          })}
        </TabsContent>
        <TabsContent value="configuration"></TabsContent>
      </Tabs>
    </div>
  );
};

export default EditAssignment;
