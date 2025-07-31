import React, { useState, useEffect } from 'react';
import { ChatState } from "../context/chatProvider";
import icon from "../assets/icon.png";
import { getSender } from "../config/chatLogic";
import { FaArrowLeft, FaUser, FaUsers } from "react-icons/fa";
import UserInfoModal from './UserInfoModal';
import GroupInfoModal from './GroupInfoModal';
import ScrollableChats from "./ScrollableChats";
import socket from "../socket";
import axios from "axios";

const MsgSection = () => {
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [showUserModal, setShowUserModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        if (user) {
            socket.emit("setup", user);
            socket.on("connected", () => console.log("Socket connected"));
        }
        return () => socket.off("connected");
    }, [user]);

    useEffect(() => {
        if (selectedChat) {
            socket.emit("join chat", selectedChat._id);
        }
    }, [selectedChat]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                },
            };
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/message`,
                { content: newMessage, chatId: selectedChat._id },
                config
            );

            socket.emit("new message", data);
            setMessages((prev) => [...prev, data]);
            setNewMessage("");

        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    return !selectedChat ? (
        <div className="flex flex-col justify-center items-center h-full text-blue-300">
            <img src={icon} alt="Logo" className="w-25" />
            <h2>Your Messages are end-to-end-encrypted</h2>
        </div>
    ) : (
        <div className="flex flex-col h-full">
            <div className="flex items-center p-3 bg-blue-400 text-white shadow-sm">
                <button onClick={() => setSelectedChat(null)}>
                    <FaArrowLeft className="text-lg" />
                </button>
                <div
                    className="flex items-center ml-5 gap-2 font-bold text-lg cursor-pointer"
                    onClick={() =>
                        !selectedChat.isGroupChat
                            ? setShowUserModal(true)
                            : setShowGroupModal(true)
                    }
                >
                    {selectedChat.isGroupChat ? (
                        <>
                            <FaUsers />
                            {selectedChat.chatName}
                        </>
                    ) : (
                        <>
                            <FaUser />
                            {getSender(user, selectedChat.users)}
                        </>
                    )}
                </div>

                {showUserModal && (
                    <UserInfoModal
                        userId={
                            selectedChat.users.find((u) => u._id !== user._id)?._id
                        }
                        onClose={() => setShowUserModal(false)}
                    />
                )}
                {showGroupModal && (
                    <GroupInfoModal
                        chat={selectedChat}
                        onClose={() => setShowGroupModal(false)}
                        refresh={(updatedChat) => setSelectedChat(updatedChat)}
                    />
                )}
            </div>

            <div className="flex-1 p-3 overflow-y-auto bg-orange-50">
                <ScrollableChats messages={messages} setMessages={setMessages} />
            </div>

            <div className="p-3 bg-white border-t flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border rounded-md px-3 py-2 focus:outline-none"
                />
                <button
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MsgSection;
