import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { combineReducers } from "@reduxjs/toolkit";

const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

const MessageUI = ({
  connection,
  messages,
  setMessages,
  setMessageSent,
  messageSent,
}) => {
  const loginUser = useSelector((store) => store.user);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [showDate, setShowDate] = useState(null);
  const bottomRef = useRef(null);
  const [scroll, setScroll] = useState(true);

  const getMessages = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/messages/${connection.user._id}?page=${page}`,
        {
          withCredentials: true,
        }
      );
      setMessages((prevMessages) => [...res.data.reverse(), ...prevMessages]);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (msg) => {
    try {
      const res = await axios.post(
        BASE_URL + `/chat/${connection.user._id}`,
        {
          content: msg,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const clearUnseen = async () => {
    try {
      await axios.post(
        BASE_URL + `/clearunseen/${connection?.user?._id}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    clearUnseen();
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [connection]);

  const handleMessage = ({ content, senderId }) => {
    if (senderId._id.toString() === connection.user._id.toString()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: content,
          sender: senderId._id,
          createdAt: new Date().toISOString(),
        },
      ]);
      setScroll(true);
      setMessageSent((prev) => prev + 1);
      clearUnseen();
    } else {
      console.log("Message for another user, not updating this chat view.");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connecting");
    });

    console.log("registering");
    socket.emit("register", loginUser._id);

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("receive message", handleMessage);

    return () => {
      socket.off("receive message", handleMessage);
    };
  }, []);

  useEffect(() => {
    getMessages(page);
  }, [connection.user._id, page]);

  useEffect(() => {
    if (scroll && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setScroll(false);
    }
  }, [messages]);

  useEffect(() => {
    console.log("scroll", scroll);
  }, [scroll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", {
        content: message,
        receiverId: connection?.user?._id,
        senderId: loginUser,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, createdAt: new Date().toISOString() },
      ]);
      setScroll(true);
      await sendMessage(message);
      setMessage("");
      setMessageSent(messageSent + 1);
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
            const { scrollTop } = e.target;
            if (scrollTop === 0) {
              loadMoreMessages();
            }
          }}
        >
          <ul className="space-y-2 flex flex-col">
            {messages.map((msg, index) => (
              <li
                key={msg._id || index}
                className={`chat ${
                  msg.sender === connection.user._id ? "chat-start" : "chat-end"
                }`}
              >
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
