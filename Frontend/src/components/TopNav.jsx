import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChatState } from "../context/chatProvider";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import icon from "../assets/icon.png";
import axios from "axios";

const TopNav = () => {
    const { user, setUser, setSelectedChat, chats, setChats } = ChatState();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();


    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            setSearchResult([]);
            alert("Please enter something to search.");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(
                `http://localhost:5000/api/user?search=${search}`,
                config
            );

            setSearchResult(data.length ? data : ["__NOT_FOUND__"]); // special flag if empty
            setLoading(false);
        } catch (error) {
            console.error("Search error:", error);
            setLoading(false);
            alert("Failed to fetch search results.");
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/chats", { userId }, config);
            console.log("Chat created/fetched:", data);

            if (!chats?.find((c) => c._id === data._id)) {
                setChats([data, ...(chats || [])]);
            }

            setSelectedChat(data);
            setLoadingChat(false);

        } catch (error) {
            alert("Error fetching the chats");
        }
    }


    return (
        <div className="relative flex justify-between items-center px-4 py-3 shadow-md bg-white text-orange-400">
            {/* Logo + Title */}
            <div className="flex items-center gap-2">
                <img src={icon} alt="Logo" className="w-8 h-8" />
                <h2 className="text-xl font-bold">Chatterly</h2>
            </div>

            <div className="flex items-center gap-6 relative">

                <div className="relative flex items-center">

                    {showSearch && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearch(value);
                                    if (value.trim() === "") {
                                        setSearchResult([]);
                                    }
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-64 px-3 py-1 mr-2 text-black border border-orange-400 rounded-md focus:outline-none focus:border-red-500 shadow-sm"
                            />

                            {searchResult.length > 0 && (
                                <div className="absolute top-full left-0 mt-1 w-full max-h-64 overflow-y-auto bg-white rounded shadow-md border border-gray-200 z-50">
                                    {searchResult[0] === "__NOT_FOUND__" ? (
                                        <div className="px-4 py-2 text-gray-500 text-sm">User not found</div>
                                    ) : (
                                        searchResult.map((u) => (
                                            <div
                                                key={u._id}
                                                className="px-4 py-2 hover:bg-orange-100 border-b cursor-pointer"
                                                onClick={() => {
                                                    accessChat(u._id);
                                                    setSearch("");
                                                    setSearchResult([]);
                                                    setShowSearch(false);
                                                }}
                                            >
                                                {u.name}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                        </div>
                    )}


                    {/* Search Icon on the right */}
                    <FaSearch
                        className="cursor-pointer text-orange-400"
                        onClick={() => setShowSearch(!showSearch)}
                    />
                </div>


                {/* Bell Icon */}
                <FaBell className="cursor-pointer" />

                {/* Username + Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-1 font-semibold"
                    >
                        <span>{user?.name || "User"}</span>
                        <FaChevronDown />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-md z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopNav;
