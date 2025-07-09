import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from '../assets/icon.png';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ChatState } from "../context/chatProvider";

const Login = () => {
    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setUser } = ChatState();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "login") {
            if (!formData.email || !formData.password) {
                alert("Please enter email and password.");
                return;
            }

            // ✅ LOGIN REQUEST
            try {
                setLoading(true);

                const res = await fetch("http://localhost:5000/api/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await res.json();
                setLoading(false);

                if (!res.ok) {
                    throw new Error(data.message || "Login failed");
                }

                alert("Login successful!");
                localStorage.setItem("userInfo", JSON.stringify(data));
                setUser(data);
                navigate("/chats");

            }
            catch (err) {
                alert(err.message);
            }
        }

        // Register
        else {
            if (
                !formData.fullName ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
            ) {
                alert("Please fill in all fields.");
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            try {
                setLoading(true);

                const res = await fetch("http://localhost:5000/api/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                    }),
                });


                const data = await res.json();
                setLoading(false);

                if (!res.ok) {
                    throw new Error(data.message || "Registration failed");
                }

                alert("Registration successful!");
                setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                setMode("login");
            } catch (err) {
                alert(err.message);
            }
        }
    };


    return (
        <div className="w-full max-w-md px-6 py-4 bg-white rounded-2xl shadow-md mx-4">
            <img
                src={icon}
                alt="Chatterly"
                className="w-24 mx-auto mb-6 block"
            />

            <div className="flex justify-center mb-6 gap-2">
                <button
                    onClick={() => {
                        setMode("register");
                        setFormData({
                            fullName: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                        });
                    }}
                    className={`px-4 py-2 rounded shadow-sm text-sm font-medium cursor-pointer ${mode === "register"
                        ? "bg-gradient-to-b from-red-500 via-orange-500 to-red-300 text-white"
                        : "bg-gray-300 text-gray-700"
                        }`}
                >
                    Register
                </button>
                <button
                    onClick={() => {
                        setMode("login");
                        setFormData({
                            fullName: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                        });
                    }}
                    className={`px-4 py-2 rounded shadow-sm text-sm font-medium cursor-pointer ${mode === "login"
                        ? "bg-gradient-to-b from-red-500 via-orange-500 to-red-300 text-white"
                        : "bg-gray-300 text-grey-200"
                        }`}
                >
                    Login
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
                {mode === "register" && (
                    <>
                        <label className="block mb-2 text-sm">Name</label>
                        <div className="relative mb-4">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                className="w-full pl-10 py-2 border rounded focus:outline-none"
                            />
                        </div>
                    </>
                )}

                <label className="block mb-2 text-sm">Email</label>
                <div className="relative mb-4">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full pl-10 py-2 border rounded focus:outline-none"
                    />
                </div>

                <label className="block mb-2 text-sm">Password</label>
                <div className="relative mb-4">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onClick={togglePasswordVisibility} >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>

                {mode === "register" && (
                    <>
                        <label className="block mb-2 text-sm">Confirm Password</label>
                        <div className="relative mb-4">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onClick={togglePasswordVisibility} >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                    </>
                )}


                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white cursor-pointer 
                        ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-gradient-to-b from-red-500 via-orange-500 to-red-300"}
                    `}
                >
                    {loading ? "Processing..." : mode === "login" ? "Login" : "Register"}
                </button>

            </form>
        </div>
    );
};

export default Login;
