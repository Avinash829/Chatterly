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
        if (!selectedChat?._id) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/message/${selectedChat._id}`,
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
        const handleNewMessage = (newMessage) => {
            // Optional: You can check here if message belongs to selected chat
            setMessages((prev) => [...prev, newMessage]);
        };

        socket.on("message received", handleNewMessage);

        return () => {
            socket.off("message received", handleNewMessage);
        };
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
                <p className="text-center text-blue-300">No messages yet.</p>
            )}

            <div ref={messagesEndRef}></div>
        </div>
    );
};

export default ScrollableChats;
