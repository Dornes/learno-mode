import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { assignmentsLoader } from "~/services/assignments-loader";
import { Assignment } from "~/types/types";
import { Drill } from "lucide-react";

export const loader: LoaderFunction = assignmentsLoader;

export default function Index() {
  const { assignments } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="w-4/5 md:w-3/5 mx-auto mt-10">
        <div className="flex flex-row items-center gap-2">
          <div className="text-9xl">Admin</div>
          <Drill />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {assignments.map((assignment: Assignment) => (
            <div key={assignment.id}>
              <Link to={`/assignment/${assignment.id}`}>
                <Card className="items-center hover:bg-gray-50 h-36 overflow-hidden">
                  <CardHeader>
                    <div className="flex flex-row space-x-2">
                      <CardTitle className="truncate">
                        {assignment.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{assignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center">
                    <p className="mt-1 font-extralight">
                      Tasks: {assignment.total_tasks}
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
