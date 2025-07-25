import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";

const GroupChatModal = ({ children }) => {
    const { user, chats, setChats } = ChatState();
    const [isOpen, setIsOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setGroupName("");
            setSelectedUsers([]);
            setSearch("");
            setSearchResults([]);
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResults(data);
            setLoading(false);
        } catch (err) {
            console.error("Search error:", err);
            setLoading(false);
        }
    };

    const handleAddUser = (userToAdd) => {
        if (selectedUsers.find((u) => u._id === userToAdd._id)) return;
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleRemoveUser = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length < 2) {
            alert("Group must have a name and at least 2 members.");
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                "/api/chats/group",
                {
                    name: groupName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );

            setChats([data, ...chats]);
            toggleModal();
        } catch (error) {
            console.error("Group creation error:", error);
            alert("Failed to create group.");
        }
    };

    return (
        <div>
            <div onClick={toggleModal} className="inline-block">
                {children}
            </div>

            {isOpen && (
                <div className="fixed inset-0  backdrop-blur-lg flex items-center justify-center z-50">
                    <div className="bg-blue-100 w-full max-w-md rounded-lg p-6 relative">
                        <h2 className="text-xl font-bold text-orange-500 mb-4">Create Group Chat</h2>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full p-2 mb-3 border border-orange-300 rounded focus:outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Add users..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full p-2 mb-3 border border-orange-300 rounded focus:outline-none"
                        />

                        <div className="flex flex-wrap mb-3 gap-2">
                            {selectedUsers.map((u) => (
                                <div
                                    key={u._id}
                                    className="bg-orange-300 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                >
                                    {u.name}
                                    <button
                                        onClick={() => handleRemoveUser(u)}
                                        className="text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {loading ? (
                            <p className="text-sm text-gray-500">Searching...</p>
                        ) : (
                            <div className="max-h-32 overflow-y-auto">
                                {searchResults.map((u) => (
                                    <div
                                        key={u._id}
                                        className="px-2 py-1 hover:bg-orange-300 cursor-pointer text-sm border rounded-md mt-1"
                                        onClick={() => handleAddUser(u)}
                                    >
                                        {u.name}
                                        <br />
                                        {u.email}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={toggleModal}
                                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChatModal;
