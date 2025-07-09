import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import SingleChat from "./singleChat";


const ScrollableChats = () => {
    const { selectedChat, user } = ChatState();
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    return (
        <div className="overflow-y-auto max-h-full px-2">
            {messages.map((m, i) => (
                <SingleChat
                    key={m._id}
                    message={m}
                    chat={selectedChat}  // pass chat info here
                    index={i}
                />
            ))}
        </div>
    );
};

export default ScrollableChats;
