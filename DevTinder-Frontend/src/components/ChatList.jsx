import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const getTimeAgo = (timestamp) => {
  if (!timestamp) return "unknown time";

  const then = new Date(timestamp);
  const now = new Date();

  if (isNaN(then.getTime())) return "invalid date";

  const diffMs = now - then;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const ChatList = () => {
  const [chats, setChats] = useState([]);

  const getChat = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chats", {
        withCredentials: true,
      });
      setChats(res.data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  useEffect(() => {
    getChat();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-6 bg-gray-50">
      {chats.length === 0 ? (
        <div className="flex justify-center items-center h-full text-center text-4xl text-gray-400">
          <span role="img" aria-label="empty-chat" className="mr-2">
            💬
          </span>
          No Chats Available
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat._id || `${chat.user?._id}-${Math.random()}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center p-4 gap-4"
            >
              <img
                src={chat.user?.photoUrl || "/default-avatar.png"}
                alt="User avatar"
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {chat.user?.firstName} {chat.user?.lastName}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {getTimeAgo(chat.latestMessage?.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {chat.latestMessage?.content || "No messages yet"}
                </p>
                <div className="text-xs text-gray-400 mt-1">
                  {chat.user?.skills?.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
