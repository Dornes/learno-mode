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
import { Form, useActionData } from "@remix-run/react";
import { Message } from "openai/src/resources/beta/threads/messages.js";
import { ScrollArea } from "../ui/scroll-area";
import MessageLoading from "./message-loading";

interface ActionData {
  messagesData: Message[];
  threadId: string;
}

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData) {
      setIsLoading(false);
    }
  }, [actionData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        className={`fixed bottom-4 right-4 w-[30rem] h-96 ${
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
        <CardContent className="h-[calc(100%-8rem)] overflow-hidden">
          <ScrollArea className="h-full">
            {actionData?.messagesData?.map((message) => (
              <div
                key={message?.id}
                className={`mb-4 pr-3 ${
                  message?.role == "user" ? "text-right" : "text-left"
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
            ))}
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

export default ChatButton;
