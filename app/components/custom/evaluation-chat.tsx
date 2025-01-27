import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import MessageLoading from "./message-loading";
import { Input } from "../ui/input";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface ActionData {
  messagesData: Message[];
  threadId: string;
}

interface EvaluationChatProps {
  solution: string;
}

const EvaluationChat = ({ solution }: EvaluationChatProps) => {
  const [input, setInput] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  useEffect(() => {
    setIsLoading(false);
  }, [actionData]);

  useEffect(() => {
    // Automatically send the solution to the chatbot when the component mounts
    if (solution) {
      const formData = new FormData();
      formData.append("message", solution);
      formData.append("action", "help-chat");
      submit(formData, { method: "post" });
    }
  }, [solution, submit]);

  const handleSubmit = () => {
    setCurrentMessage(input); // Set the current message to the input value
    setInput(""); // Clear the input field
    setIsLoading(true); // Show the loading indicator
  };

  const ApprovedMessage = () => {
    return (
      <div className="text-left">
        <span className="inline-block p-2 rounded-lg bg-green-500 text-white">
          Your code has been approved!
          <CheckCircleIcon className="w-6 h-6 mr-2" />
        </span>
      </div>
    );
  };

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
                    {message?.content[0].text.value.includes("Approved") ? (
                      <ApprovedMessage />
                    ) : (
                      message?.content[0].text.value
                    )}
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
            <input type="hidden" name="threadId" value={actionData?.threadId} />
            <Button type="submit" value="help-chat" name="action">
              Send
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EvaluationChat;
