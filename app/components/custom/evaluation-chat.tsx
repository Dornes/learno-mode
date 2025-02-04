import { Form, Link, useActionData, useSubmit } from "@remix-run/react";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import MessageLoading from "./message-loading";
import { Input } from "../ui/input";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { STATUS } from "~/types/types";

interface ActionData {
  messagesData: Message[];
  threadId: string;
}

interface EvaluationChatProps {
  solution: string;
  taskId: number;
  status: STATUS;
  feedback?: string;
}

const EvaluationChat = ({
  solution,
  taskId,
  status,
  feedback,
}: EvaluationChatProps) => {
  const [input, setInput] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();
  const isApproved = status === "APPROVED";
  const isRejected = status === "NOT_APPROVED";

  useEffect(() => {
    setIsLoading(false);
    // Checks if any of the messages contain the word "Approved" and approves the task
    for (const message of actionData?.messagesData ?? []) {
      if (message.role === "assistant") {
        if (message.content[0].text.value.includes("I approve this task")) {
          const feedbackValue = message.content[0].text.value.split(
            "I approve this task"
          )[1];
          approveTask(feedbackValue);
          break;
        } else if (
          message.content[0].text.value.includes(
            "I think you could use a little extra work"
          )
        ) {
          const feedbackValue = message.content[0].text.value.split(
            "I think you could use a little extra work"
          )[1];
          rejectTask(feedbackValue);
          break;
        }
      }
    }
  }, [actionData]);

  useEffect(() => {
    // Automatically send the solution to the chatbot when the component mounts
    if (solution) {
      const formData = new FormData();
      formData.append("message", solution);
      formData.append("action", "help-chat");
      submit(formData, { method: "post" });
      setIsLoading(true);
    }
  }, [solution, submit]);

  const approveTask = (feedbackValue: string) => {
    const formData = new FormData();
    formData.append("taskId", taskId.toString());
    formData.append("feedback", feedbackValue);
    formData.append("action", "approve-task");
    submit(formData, { method: "post" });
  };

  const rejectTask = (feedbackValue: string) => {
    const formData = new FormData();
    formData.append("taskId", taskId.toString());
    formData.append("feedback", feedbackValue);
    formData.append("action", "reject-task");
    submit(formData, { method: "post" });
  };

  const handleSubmit = () => {
    setCurrentMessage(input); // Set the current message to the input value
    setInput(""); // Clear the input field
    setIsLoading(true); // Show the loading indicator
  };

  const ApprovedMessage = () => {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-6 flex-col">
          <h1 className="text-2xl font-medium">
            Good job! The task has been approved
          </h1>
          <p> {feedback}</p>
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex justify-center gap-4">
          <Link to={`/`} className={buttonVariants({ variant: "outline" })}>
            Take me home!
          </Link>
        </div>
      </div>
    );
  };

  const RejectedMessage = () => {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-6 flex-col">
          <h1 className="text-2xl font-medium">
            I think you could use a little extra work
          </h1>
          <p> {feedback}</p>
          <CheckCircleIcon className="w-8 h-8 text-red-600" />
        </div>
        <div className="flex justify-center gap-4">
          <Link to={`/`} className={buttonVariants({ variant: "outline" })}>
            Take me home!
          </Link>
        </div>
      </div>
    );
  };

  if (isApproved) {
    return <ApprovedMessage />;
  } else if (isRejected) {
    return <RejectedMessage />;
  } else {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="fixed bottom-4 p-4 w-3/4">
          <CardContent className="overflow-hidden">
            <ScrollArea className="h-[400px]">
              {actionData?.messagesData?.map((message, index) => {
                // Check if the message is the first one (solution) by its position or content
                const isInitialSolution =
                  index === 0 && message?.content[0]?.text.value === solution;

                if (isInitialSolution) {
                  return null;
                }

                return (
                  <div
                    key={message?.id}
                    className={`mb-4 pr-3 ${
                      message?.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        message?.role === "user"
                          ? `bg-blue-500 text-white`
                          : `bg-gray-200 text-black`
                      }`}
                    >
                      {message?.content[0].text.value}
                    </span>
                  </div>
                );
              })}
              {isLoading ? (
                <div className="text-right">
                  <span className="inline-block p-2 rounded-lg bg-blue-500 text-white">
                    {currentMessage}
                  </span>
                  <div className="text-left">
                    <MessageLoading />
                  </div>
                </div>
              ) : null}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Form
              className="flex w-full space-x-2"
              method="post"
              onSubmit={handleSubmit}
            >
              <Input
                name="message"
                placeholder="Type your message..."
                className="flex-grow"
                value={input || ""}
                onChange={(e) => setInput(e.target.value)} // Update input state on change
              />
              <input
                type="hidden"
                name="threadId"
                value={actionData?.threadId}
              />
              <Button type="submit" value="help-chat" name="action">
                Send
              </Button>
            </Form>
          </CardFooter>
        </Card>
      </div>
    );
  }
};

export default EvaluationChat;
