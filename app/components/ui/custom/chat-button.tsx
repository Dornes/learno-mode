import { useState } from "react";
import { Button } from "../button";
import { BotMessageSquare } from "lucide-react";

const ChatButton = () => {
    return (
        <div>
            <Button className="fixed bottom-4 right-4 rounded-full p-4">Ask Ai <BotMessageSquare /></Button>
        </div>
    );
};

export default ChatButton;