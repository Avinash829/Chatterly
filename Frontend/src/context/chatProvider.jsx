import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            setUser(userInfo);
        } catch (error) {
            console.error("Error parsing userInfo from localStorage:", error);
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    }, []);


    return (
        <ChatContext.Provider value={{ user, setUser, loadingUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
