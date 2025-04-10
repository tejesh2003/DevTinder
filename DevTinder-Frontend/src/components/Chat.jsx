import { useState } from "react";
import ChatList from "./ChatList";
import MessageUI from "./MessageUI";

const ChatSocket = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  return (
    <div className="flex flex-grow min-h-0">
      <div className="w-1/2 overflow-y-auto p-4">
        <ChatList setConnection={setConnection} />
      </div>

      <div className="w-1/2 flex items-center justify-center p-4">
        {connection ? (
          <MessageUI
            connection={connection}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className="h-[86vh] w-[80%] flex items-center justify-center text-xl text-gray-500 p-8 rounded-xl shadow-lg">
            <span role="img" aria-label="no-chat" className="mr-2">
              💬
            </span>
            Open any chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSocket;
