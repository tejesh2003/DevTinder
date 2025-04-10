import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";

const socket = io("http://localhost:7777", {
  withCredentials: true,
  transports: ["websocket"],
});

const MessageUI = ({ connection, messages, setMessages }) => {
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [showDate, setShowDate] = useState(null);
  const bottomRef = useRef(null);

  const getMessages = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/messages/${connection.user._id}?page=${page}`,
        {
          withCredentials: true,
        }
      );
      setMessages((prevMessages) => [...res.data, ...prevMessages]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMessages(page);

    const handleMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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
  }, [connection.user._id, page, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  const loadMoreMessages = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const toggleDate = (msgId) => {
    if (showDate === msgId) {
      setShowDate(null);
    } else {
      setShowDate(msgId);
    }
  };

  return (
    <div className="w-full md:w-11/12 bg-base-300 shadow-xl rounded-lg p-6">
      <div className="flex items-center justify-center mb-4">
        <img
          src={connection?.user?.photoUrl || "/default-avatar.png"}
          alt="User avatar"
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <h2 className="text-xl font-bold text-gray-800">
          {connection?.user?.firstName} {connection?.user?.lastName}
        </h2>
      </div>

      <div className="h-[calc(100vh-230px)] overflow-hidden flex flex-col">
        <div
          className="flex-grow overflow-y-auto border rounded p-4 mb-4 bg-base-100"
          onScroll={(e) => {
            if (e.target.scrollTop === 0) {
              loadMoreMessages();
            }
          }}
        >
          <ul className="space-y-2">
            {messages
              .slice()
              .reverse()
              .map((msg) => (
                <li key={msg._id} className="chat chat-start">
                  <div
                    className="chat-bubble cursor-pointer"
                    onClick={() => toggleDate(msg._id)}
                  >
                    {msg.content}
                  </div>
                  {showDate === msg._id && (
                    <div className="chat-footer">
                      <span className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            <div ref={bottomRef} />
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 pl-2 pb-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="input input-bordered w-full pl-2"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageUI;
