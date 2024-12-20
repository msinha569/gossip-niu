import React, { useEffect, useRef, useState } from "react";
import { useFirebase } from "../context/firebase";
import { BackgroundGradient } from "./ui/background-gradient";

function ChatBox() {
  const [message, setMessage] = useState("");
  const {
    handleSendMessage,
    receivedMessages,
    handleReceiveMessage,
    loggedInUser,
  } = useFirebase();
  const bottomRef = useRef(null);

  useEffect(() => {
    handleReceiveMessage();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [receivedMessages]);

  const callHandleSendMessage = () => {
    if (message.trim()) {
      handleSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <BackgroundGradient className="h-96 p-2">
      <div className="h-full w-full flex flex-col">
        {/* Message Display Area */}
        <div className="flex-1 overflow-y-auto p-2 hide-scrollbar w-full overflow-x-hidden">
          {receivedMessages.length === 0 ? (
            <div>Loading Chats...</div>
          ) : (
            receivedMessages.map((msg) => (
<div
  key={msg.id}
  className={`w-full m-2 rounded-md flex flex-col ${
    loggedInUser === msg.user
      ? "bg-gradient-to-t from-black/80 to-white-800/80 items-end px-4 shadow-lg"
      : "bg-gradient-to-t from-gray-900/80 to-black/80 items-start px-4 shadow-lg"
  } p-2 backdrop-blur-sm border border-gray-700`}
>
  {/* Message Text */}
  <div className="text-md font-semibold text-gray-100">{msg.message}</div>
  {/* Timestamp */}
  <div className="text-xs text-gray-500">
    {msg.timestamp?.toDate().toLocaleString()}
  </div>
</div>


            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input and Button */}
        <div className="flex flex-row justify-end items-center p-4">
          <input
            placeholder="Enter Your Message"
            className="rounded-md w-80 p-2 focus:outline-none"
            value={message}
            onKeyDown={(e) => e.key === "Enter" && callHandleSendMessage()}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-md"
            onClick={() => callHandleSendMessage()}
          >
            ✏️
          </button>
        </div>
      </div>
    </BackgroundGradient>
  );
}

export default ChatBox;
