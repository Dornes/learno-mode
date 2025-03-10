import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import MessageLoading from "./message-loading";
import { Input } from "../ui/input";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { STATUS } from "~/types/types";
import FeedbackMessage from "./feedback-message";

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

  const evaluateTask = useCallback(
    (feedbackValue: string, approved: boolean) => {
      const formData = new FormData();
      formData.append("taskId", taskId.toString());
      formData.append("feedback", feedbackValue);
      formData.append("isApproved", approved.toString());
      formData.append("threadId", actionData?.threadId || "");
      formData.append("action", "evaluate-task");
      submit(formData, { method: "post" });
    },
    [actionData?.threadId, submit, taskId]
  );

  // Checks if any of the messages contain the string "I approve this task." and approves the task
  useEffect(() => {
    setIsLoading(false);

    for (const message of actionData?.messagesData ?? []) {
      if (message.role === "assistant") {
        // Safely get the first block
        const firstBlock = message?.content?.[0];

        // Narrow the type: Make sure it's a text block
        if (firstBlock?.type === "text") {
          const { value } = firstBlock.text;

          if (value.includes("I approve this task.")) {
            const feedbackValue = value.split("I approve this task.")[1];
            evaluateTask(feedbackValue, true);
            break;
          } else if (
            value.includes("I think you could use a little extra work.")
          ) {
            const feedbackValue = value.split(
              "I think you could use a little extra work."
            )[1];
            evaluateTask(feedbackValue, false);
            break;
          }
        }
      }
    }
  }, [actionData, evaluateTask]);

  // Automatically send the solution to the chatbot when the component mounts
  useEffect(() => {
    if (solution) {
      const formData = new FormData();
      formData.append("message", solution);
      formData.append("action", "evaluate-chat");
      submit(formData, { method: "post" });
      setIsLoading(true);
    }
  }, [solution, submit]);

  const handleSubmit = () => {
    setCurrentMessage(input); // Set the current message to the input value
    setInput(""); // Clear the input field
    setIsLoading(true); // Show the loading indicator
  };

  if (isApproved) {
    return <FeedbackMessage feedback={feedback || ""} isApproved={true} />;
  } else if (isRejected) {
    return <FeedbackMessage feedback={feedback || ""} isApproved={false} />;
  } else {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="fixed bottom-4 p-4 w-3/4">
          <CardContent className="overflow-hidden">
            <ScrollArea className="h-[400px]">
              {actionData?.messagesData?.map((message, index) => {
                // For safety, get the first block
                const firstBlock = message?.content[0];

                // If there's no first block or it's not a text block, just skip/return null
                if (!firstBlock || firstBlock.type !== "text") {
                  return null;
                }

                // Now TypeScript knows firstBlock is a text block
                const isInitialSolution =
                  index === 0 && firstBlock.text.value === solution;

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
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {firstBlock.text.value}
                    </span>
                  </div>
                );
              })}

              {isLoading ? (
                <div className="text-right">
                  {currentMessage && (
                    <span className="inline-block p-2 rounded-lg bg-blue-500 text-white">
                      {currentMessage}
                    </span>
                  )}
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
                autoComplete="off"
                value={input || ""}
                onChange={(e) => setInput(e.target.value)} // Update input state on change
              />
              <input
                type="hidden"
                name="threadId"
                value={actionData?.threadId}
              />
              <Button type="submit" value="evaluate-chat" name="action">
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
