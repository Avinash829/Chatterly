import React from 'react';
import TopNav from '../components/TopNav';
import MyChats from '../components/MyChats';
import MsgSection from '../components/MsgSection';
import { ChatState } from '../context/chatProvider';

const Chats = () => {
    const { user, selectedChat } = ChatState();

    return (
        <div className="w-full h-screen flex flex-col">
            {user && <TopNav />}

            {user && (
                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden md:flex w-full">
                        <div className="w-1/3 overflow-y-auto border-r">
                            <MyChats />
                        </div>
                        <div className="w-2/3 overflow-y-auto">
                            <MsgSection />
                        </div>
                    </div>

                    <div className="flex w-full md:hidden">
                        {!selectedChat ? (
                            <div className="w-full overflow-y-auto">
                                <MyChats />
                            </div>
                        ) : (
                            <div className="w-full overflow-y-auto">
                                <MsgSection />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;
