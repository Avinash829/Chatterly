import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChatState } from "../context/chatProvider";
import { FaChevronDown } from "react-icons/fa";
import icon from "../assets/icon.png";
import axios from "axios";

const TopNav = () => {
    const { user, setUser, setSelectedChat, chats, setChats } = ChatState();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
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

            setSearchResult(data.length ? data : ["__NOT_FOUND__"]);
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

            if (!chats?.find((c) => c._id === data._id)) {
                setChats([data, ...(chats || [])]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
        } catch (error) {
            alert("Error fetching the chats");
        }
    };

    return (
        <>
            <div className="flex md:flex-row md:justify-between md:items-center px-4 py-3 lg:shadow-md bg-white text-blue-400">
                <div className="flex items-center gap-2">
                    <img src={icon} alt="Logo" className="w-8 h-8" />
                    <h2 className="text-xl font-bold">Chatterly</h2>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-2 md:mt-0 md:flex-nowrap">

                    <div className="hidden md:block w-64 relative">
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
                            className="w-full px-3 py-1 text-black border border-blue-400 rounded-md focus:outline-none focus:border-red-500 shadow-sm"
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
                                            }}
                                        >
                                            {u.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="absolute right-4 top-4 md:static md:right-0">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-1 font-semibold whitespace-nowrap"
                        >
                            <span>{user?.name || "User"}</span>
                            <FaChevronDown />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-md z-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-rose-500 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div className="block md:hidden w-full px-4 m-2 bg-white">
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
                    className="w-full px-3 py-2 text-black border border-orange-400 rounded-md focus:outline-none focus:border-red-500"
                />

                {searchResult.length > 0 && (
                    <div className="mt-1 w-full max-h-64 overflow-y-auto bg-white rounded shadow-md border border-gray-200 z-50">
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
                                    }}
                                >
                                    {u.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default TopNav;
