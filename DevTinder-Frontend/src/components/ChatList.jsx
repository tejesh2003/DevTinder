import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUnseen } from "../utils/unseenSlice";

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

const ChatList = ({ setConnection, connection, messageSent, messages }) => {
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  const getUnseen = async () => {
    try {
      const res = await axios.get(BASE_URL + "/totalunseen", {
        withCredentials: true,
      });
      dispatch(setUnseen(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  const getChat = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chats", {
        withCredentials: true,
      });
      setChats(res.data);
      getUnseen();
    } catch (err) {
      console.error("Failed to fetch chats:", err);
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
  const getlatestMessage = async (id) => {
    try {
      const res = await axios.get(BASE_URL + `/latestMessage/${id}`, {
        withCredentials: true,
      });
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.user._id === id
            ? { ...chat, latestMessage: res.data.latestMessage }
            : chat
        )
      );
    } catch (error) {
      console.error("Failed to fetch latest message:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getChat();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (connection) {
      getlatestMessage(connection?.user?._id);
      // clearUnseen();
      setTimeout(() => {
        clearUnseen();
      }, 1000);
    }
  }, [messageSent, messages]);

  useEffect(() => {
    getChat();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-6 bg-base-200">
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
              className="rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center bg-base-100 p-4 gap-4"
              onClick={() => {
                setConnection(chat);
                setChats((prevChats) =>
                  prevChats.map((c) =>
                    c._id === chat._id ? { ...c, unseen: 0 } : c
                  )
                );
              }}
            >
              <div className="relative">
                <img
                  src={chat.user?.photoUrl || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
                {chat.unseen > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {chat.unseen}
                  </span>
                )}
              </div>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
