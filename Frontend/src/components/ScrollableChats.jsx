import React, { useEffect, useRef } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import socket from "../socket";
import SingleChat from "./singleChat";

let selectedChatCompare = null;

const ScrollableChats = ({ messages, setMessages }) => {
    const { selectedChat, user } = ChatState();
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            selectedChatCompare = selectedChat;
        }
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => socket.off("message received");
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="overflow-y-auto max-h-full px-2">
            {messages.map((msg) => (
                <SingleChat key={msg._id} message={msg} chat={selectedChat} />
            ))}

            {messages.length === 0 && (
                <p className="text-center text-gray-500">No messages yet.</p>
            )}

            <div ref={messagesEndRef}></div>
        </div>
    );
};

export default ScrollableChats;
