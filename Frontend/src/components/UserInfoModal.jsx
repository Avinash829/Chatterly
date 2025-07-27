import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";

const UserInfoModal = ({ userId, onClose }) => {
    const [commonGroups, setCommonGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { chats, user } = ChatState();

    useEffect(() => {
        if (!userId || !chats) return;

        const groups = chats.filter(
            (chat) =>
                chat.isGroupChat &&
                chat.users.some((u) => u._id === userId)
        );

        setCommonGroups(groups);
        setLoading(false);
    }, [userId, chats]);

    return (
        <div className="fixed inset-0  backdrop-blur-lg flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-md w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-orange-500">Groups in Common</h2>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : commonGroups.length === 0 ? (
                    <p className="text-gray-500">No groups in common.</p>
                ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {commonGroups.map((group) => (
                            <li key={group._id} className="p-2 bg-blue-200 text-amber-600 rounded-md">
                                {group.chatName}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserInfoModal;