import { useState } from "react";
import { BotMessageSquare, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "../ui/card";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  // Placeholder function for now
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Message sent: ", input);
    setInput("");
  };

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
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              placeholder="Type your message..."
              className="flex-grow"
              onChange={handleInput}
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatButton;
