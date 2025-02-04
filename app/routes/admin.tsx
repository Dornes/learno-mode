import { LoaderFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
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
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import BackButton from "~/components/custom/back-button";

export const loader: LoaderFunction = assignmentsLoader;

export default function Index() {
  const { assignments } = useLoaderData<typeof loader>();
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
    }
  }, [message, navigate]);

  return (
    <>
      <BackButton to="/" />
      <div className="w-4/5 md:w-3/5 mx-auto mt-20">
        <div className="flex flex-row items-center gap-2 w-full">
          <div className="text-4xl">Admin</div>
          <Drill className="h-7 w-7" />
          <Link className="ml-auto" to={"/create-assignment"}>
            <Button className="">New assignment</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {assignments.map((assignment: Assignment) => (
            <div key={assignment.id}>
              <Link to={`/edit-assignment/${assignment.id}`}>
                <Card className="items-center hover:bg-gray-50 h-40">
                  <CardHeader>
                    <div className="flex flex-row space-x-2">
                      <CardTitle>{assignment.title}</CardTitle>
                    </div>
                    <CardDescription>{assignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center">
                    <p className="font-extralight">
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
