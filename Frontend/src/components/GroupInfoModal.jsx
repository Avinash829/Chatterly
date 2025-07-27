import React, { useState } from 'react';
import axios from 'axios';
import { ChatState } from '../context/chatProvider';

const GroupInfoModal = ({ chat, onClose, refresh }) => {
    const { user, setSelectedChat } = ChatState();
    const [newGroupName, setNewGroupName] = useState("");


    const isAdmin = chat.groupAdmin._id === user._id;

    const handleRemoveUser = async (userId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const { data } = await axios.put("/api/chats/groupremove", {
                chatId: chat._id,
                userId,
            }, config);

            refresh(data);
            if (userId === user._id) {
                setSelectedChat(null);
                onClose();
            }
        } catch (err) {
            console.error("Error removing user:", err);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">

                <h2 className="text-xl font-semibold mb-4 text-cyan-500">Group Members</h2>
                <ul className="space-y-2 text-amber-400">
                    {chat.users.map((u) => (
                        <li key={u._id} className="flex justify-between items-center">
                            <span>{u.name}</span>
                            {isAdmin && u._id !== user._id && (
                                <button
                                    onClick={() => handleRemoveUser(u._id)}
                                    className="text-sm bg-cyan-400 text-white px-2 py-1 rounded hover:bg-green-400"
                                >
                                    Remove
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="mt-6 flex justify-end gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                    >
                        Close
                    </button>

                    {isAdmin ? (
                        <div className="w-full mt-3">
                            {/* <input
                                type="text"
                                placeholder="Enter email to add"
                                className="w-full px-3 py-2 border rounded mb-2 bg-gray-300 text-black"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-cyan-400 text-white rounded hover:bg-green-500"
                            >
                                Add Member
                            </button> */}
                        </div>
                    ) : (
                        <button
                            onClick={() => handleRemoveUser(user._id)}
                            className="px-4 py-2 bg-cyan-400 text-white rounded hover:bg-green-500"
                        >
                            Leave Group
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupInfoModal;
