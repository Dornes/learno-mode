import { useEffect, useState } from "react";
import { BotMessageSquare, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { ScrollArea } from "../ui/scroll-area";
import MessageLoading from "./message-loading";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { MarkdownRenderer } from "./markdown-renderer";
import OpenAI from "openai";

interface ActionData {
  messagesData: Message[];
  threadId: string;
}

interface ChatButtonProps {
  taskDescription: string;
  threadId?: string;
  thread?: OpenAI.Beta.Threads.Messages.Message[];
}

const ChatButton = ({ taskDescription, threadId, thread }: ChatButtonProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  useEffect(() => {
    setIsLoading(false);
  }, [actionData]);
  // Automatically send the task description to the chatbot when the component mounts
  useEffect(() => {
    if (!threadId) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("message", taskDescription);
      formData.append("action", "assistant-chat");
      submit(formData, { method: "post" });
    }
  }, [taskDescription, submit, threadId]);

  const handleSubmit = () => {
    setCurrentMessage(input); // Set the current message to the input value
    setInput(""); // Clear the input field
    setIsLoading(true); // Show the loading indicator
  };

  return (
    <div>
      <Button
        className="fixed bottom-4 right-4 rounded-full p-6 h-16 w-30 text-lg [&_svg]:size-7"
        onClick={() => setOpen(!open)}
      >
        Ask AI <BotMessageSquare />
      </Button>
      <Card
        className={`fixed bottom-4 right-4 w-[50rem] h-96 ${
          open ? "block" : "hidden"
        }`}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Chat with AI</CardTitle>
            <Button
              className="size-8 [&_svg]:size-6"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-8rem)] w-full">
          <ScrollArea className="h-full">
            {(actionData?.messagesData ?? thread)?.map((message, index) => {
              const firstBlock = message?.content?.[0];

              if (firstBlock?.type !== "text") return null;

              const isTaskDescription =
                index === 0 && firstBlock.text.value === taskDescription;
              if (isTaskDescription) return null;

              const isUser = message?.role === "user";

              return (
                <div
                  key={message?.id}
                  className={`mb-4 pr-3 ${isUser ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <MarkdownRenderer content={firstBlock.text.value} />
                  </span>
                </div>
              );
            })}

            {isLoading ? (
              <div className="text-right space-y-2">
                {currentMessage && (
                  <span className="inline-block p-2 mr-3 rounded-lg bg-blue-500 text-white">
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
              value={input || ""}
              onChange={(e) => setInput(e.target.value)} // Update input state on change
            />
            <input
              type="hidden"
              name="threadId"
              value={threadId ?? actionData?.threadId}
            />
            <Button type="submit" value="assistant-chat" name="action">
              Send
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatButton;
