import { Link } from "@remix-run/react";
import { CheckCircleIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";

interface FeedbackMessageProps {
  feedback: string;
  isApproved: boolean;
}

const FeedbackMessage = ({ feedback, isApproved }: FeedbackMessageProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-center gap-3 mb-6 flex-col">
        <h1 className="text-2xl font-medium">
          {isApproved
            ? "Good job! The task has been approved"
            : "I think you could use a little extra work"}
        </h1>
        <p>{feedback}</p>
      </div>
      <div className="flex justify-center gap-4">
        <Link to={`/`} className={buttonVariants({ variant: "outline" })}>
          Take me home!
        </Link>
      </div>
    </div>
  );
};

export default FeedbackMessage;
