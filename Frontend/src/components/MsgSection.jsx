import React, { useState, useEffect } from 'react';
import { ChatState } from "../context/chatProvider";
import icon from "../assets/icon.png";
import { getSender } from "../config/chatLogic";
import { FaArrowLeft } from "react-icons/fa";
import UserInfoModal from './UserInfoModal';
import GroupInfoModal from './GroupInfoModal';
import { FaUser, FaUsers } from "react-icons/fa";
import ScrollableChats from "./ScrollableChats";
import socket from "../socket";


const MsgSection = () => {
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [showUserModal, setShowUserModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);

    useEffect(() => {
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
    }, []);



    if (!selectedChat) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <img src={icon} alt="Logo" className="w-25" />
                <h2>Your Messages are end-to-end-encrypted</h2>
            </div>
        );
    }


    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
            <div className="flex items-center p-3 bg-orange-400 shadow-sm text-white">
                <button className='hover:text-white' onClick={() => setSelectedChat(null)}>
                    <FaArrowLeft className="text-lg" />
                </button>
                <div
                    className="flex items-center gap-2 font-bold text-lg cursor-pointer ml-5"
                    onClick={() => {
                        if (!selectedChat?.isGroupChat) setShowUserModal(true);
                        else setShowGroupModal(true);
                    }}
                >
                    {selectedChat?.isGroupChat ? (
                        <>
                            <FaUsers className="text-white" />
                            {selectedChat.chatName}
                        </>
                    ) : (
                        <>
                            <FaUser className="text-white" />
                            {getSender(user, selectedChat?.users || [])}
                        </>
                    )}
                </div>

                {showUserModal && (
                    <UserInfoModal
                        userId={selectedChat.users.find(u => u._id !== user._id)?._id}
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

            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto bg-orange-50">
                <ScrollableChats />
            </div>

            {/* Input Box */}
            <div className="p-3 border-t bg-white flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 border rounded-md px-3 py-2 focus:outline-none"
                />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                    Send
                </button>
            </div>
        </div>
    );
};

export default MsgSection;
