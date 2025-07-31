import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import { ChatState } from "../context/chatProvider";

const Home = () => {
    const { user, loadingUser } = ChatState();

    if (loadingUser) return <div>Loading...</div>;
    if (user) return <Navigate to="/chats" replace />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500">
            <Login />
        </div>
    );
}

export default Home;