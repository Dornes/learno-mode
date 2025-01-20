import { useState } from "react";
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

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const actionData = useActionData<Message[]>();

  // Placeholder function for now
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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
        className={`fixed bottom-4 right-4 w-[30rem] ${
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
              {" "}
              <X />{" "}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {actionData?.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role == "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-200 text-black`
                }`}
              >
                {message.content[0].text.value}
              </span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Form className="flex w-full space-x-2" method="post">
            <Input
              name="message"
              value={input}
              placeholder="Type your message..."
              className="flex-grow"
              onChange={handleInput}
            />
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
