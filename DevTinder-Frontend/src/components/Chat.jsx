import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:7777", {
  withCredentials: true,
  transports: ["websocket"],
});

const ChatSocket = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const handleMessage = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-end min-h-screen items-center bg-base-200 p-4">
      <div className="w-full md:w-1/2 bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Socket.IO Chat</h2>

        <div className="h-72 overflow-y-auto border rounded p-4 mb-4 bg-base-100">
          <ul className="space-y-2">
            {chatMessages.map((msg, index) => (
              <li key={index} className="chat chat-start">
                <div className="chat-bubble">{msg}</div>
              </li>
            ))}
            <div ref={bottomRef} />
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSocket;
