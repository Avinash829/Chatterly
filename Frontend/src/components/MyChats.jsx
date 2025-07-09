import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { ChatState } from '../context/chatProvider';
import { getSender } from '../config/chatLogic';
import GroupChatModal from './GroupChatModal';
import { FaUser, FaUsers } from "react-icons/fa";


const MyChats = () => {

    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const loggedUser = user;

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chats", config);
            console.log(data);
            setChats(data);
        } catch (error) {
            alert("failed to load chats");
        }
    }

    useEffect(() => {
        fetchChats();
    }, []);


    return (
        <div className="p-4 bg-white rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-orange-500">My Chats</h2>
                <GroupChatModal>
                    <button className="text-sm bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded-md">
                        + New Group
                    </button>
                </GroupChatModal>
            </div>

            {chats?.length > 0 ? (
                chats.map((chat) => (
                    <div
                        key={chat._id}
                        className="p-3 bg-orange-100 mb-2 rounded-md hover:bg-orange-200 cursor-pointer"
                        onClick={() => setSelectedChat(chat)}
                    >
                        <div className="flex items-center gap-2">
                            {chat.isGroupChat ? (
                                <>
                                    <FaUsers className="text-orange-600" />
                                    <span>{chat.chatName}</span>
                                </>
                            ) : (
                                <>
                                    <FaUser className="text-orange-600" />
                                    <span>{getSender(loggedUser, chat.users)}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-gray-500 text-sm">No chats found</div>
            )}
        </div>

    );
}

export default MyChats;
