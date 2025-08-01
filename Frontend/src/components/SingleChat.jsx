import React from "react";
import { ChatState } from "../context/chatProvider";

const SingleChat = ({ message, chat }) => {
    const { user } = ChatState();
    const isOwnMessage = message.sender._id === user._id;
    const isGroupChat = chat?.isGroupChat;

    const bubbleClass = isOwnMessage
        ? "rounded-t-3xl rounded-bl-3xl bg-cyan-400 text-white"
        : "rounded-t-3xl rounded-br-3xl bg-gray-200 text-black";

    return (
        <div
            className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} mb-2`}
        >
            {!isOwnMessage && isGroupChat && (
                <span className="text-xs text-gray-500 pl-2 mb-0.5">
                    {message.sender.name}
                </span>
            )}
            <div
                className={`px-4 py-2 max-w-[75%] break-words ${bubbleClass}`}
            >
                {message.content}
            </div>
        </div>
    );
};

export default SingleChat;
