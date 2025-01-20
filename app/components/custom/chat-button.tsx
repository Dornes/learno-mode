import { useState } from "react";
import { BotMessageSquare, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const actionData = useActionData<string>();

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
        {actionData && (
          <div className="p-4 bg-gray-100">
            <p className="text-sm text-gray-600">AI Response:</p>
            <p className="text-lg">{actionData}</p>
          </div>
        )}
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
