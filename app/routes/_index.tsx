import { type MetaFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { CircleCheckBig } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { assignmentsLoader } from "~/services/assignments-loader";
import { Assignment } from "~/types/types";

export const meta: MetaFunction = () => {
  return [{ title: "Learno Mode" }];
};

export const loader: LoaderFunction = assignmentsLoader;

export default function Index() {
  const { data: assignments } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="w-4/5 md:w-3/5 2xl:w-2/5 mx-auto mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((assignment: Assignment) => (
            <div key={assignment.id}>
              <Link to={`/assignment.${assignment.id}`}>
                <Card className="items-center hover:bg-gray-50">
                  <CardHeader>
                    <div className="flex flex-row space-x-2">
                      <CardTitle>{assignment.title}</CardTitle>
                      <CircleCheckBig
                        className={clsx("w-6 h-6 flex-shrink-0 flex-grow-0", {
                          "text-green-500": assignment.all_tasks_approved,
                        })}
                      />
                    </div>
                    <CardDescription>{assignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={
                        100 *
                        (assignment.approved_tasks / assignment.total_tasks)
                      }
                    />
                    <p className="mt-1 font-extralight">
                      Tasks approved:{" "}
                      {assignment.approved_tasks + "/" + assignment.total_tasks}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {assignments && assignments.length === 0 && (
        <p className="text-center text-xl text-semibold">
          No assignments found :c
        </p>
      )}
    </>
  );
}
