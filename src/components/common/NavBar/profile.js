import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

export const Profile = ({ isProfileOpen, setProfileOpen }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const ProfileRef = useRef(null);
    const navigate = useNavigate();

    const { user, login, logout } = useAuth();

    const toggleProfile = () => {
        setProfileOpen(!isProfileOpen);
    };

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
        setErrorMessage("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleViewProfile = () => {
        setProfileOpen(false);
        navigate('/profile');
    };

    const handleRegister = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
    
        try {
            const response = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                if (data.message === "User already exists") {
                    setErrorMessage("User with this email already exists.");
                } else {
                    setErrorMessage("Registration failed. Please try again.");
                }
                return;
            }
    
            login(data.token, {
                name: data.name || data.email,
                email: data.email
            });
            setProfileOpen(false);
            setErrorMessage("");
            
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");
    
        try {
            const response = await fetch(`http://${process.env.REACT_APP_BACKEND_PORT}:${process.env.REACT_APP_BACKEND_PORT}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                if (data.message === "Invalid email or password") {
                    setErrorMessage("Invalid email or password.");
                } else {
                    setErrorMessage("Login failed. Please try again.");
                }
                return;
            }
    
            // Store the token and user data
            login(data.token, {
                name: data.name || data.email,
                email: data.email
            });
            setProfileOpen(false);
            setErrorMessage("");
            
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileOpen]);
    

    return (
        <div className="group" ref={ProfileRef}>
            <button
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 p-1.5 rounded-full hover:bg-gray-100 active:scale-95"
                onClick={toggleProfile}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            </button>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 lg:w-72 bg-white shadow-lg rounded-md overflow-hidden z-[110] border border-gray-100">
                    {user ? (
                        <div className="p-4">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium text-gray-800">
                                    {user.name || user.email}
                                </p>
                                <button
                                    onClick={handleViewProfile}
                                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 text-sm font-medium transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 text-sm font-medium transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Display registration/sign-in form if no user is logged in
                        <>
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800 mb-1">
                                    {isSignUp ? "Sign Up" : "Sign In"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {isSignUp ? "Create a new account" : "Access your account"}
                                </p>
                            </div>
                            <form className="p-4 space-y-3" onSubmit={isSignUp ? handleRegister : handleLogin}>
                                {/* Display error message if exists */}
                                {errorMessage && (
                                    <div className="text-sm text-red-600 text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                {/* Username Field (Only for Sign Up) */}
                                {isSignUp && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                )}

                                {/* Password Field */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 text-sm font-medium transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSignUp ? "Sign Up" : "Sign In"}
                                </button>

                                {/* Forgot Password (Only for Sign In) */}
                                {!isSignUp && (
                                    <div className="text-center text-sm text-gray-600">
                                        <a
                                            href="#"
                                            className="hover:text-gray-900 transition duration-300 hover:underline"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                )}

                                {/* Toggle Between Sign In and Sign Up */}
                                <div className="text-center text-sm text-gray-600">
                                    {isSignUp ? (
                                        <p>
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={toggleSignUp}
                                                className="hover:text-gray-900 transition duration-300 hover:underline"
                                            >
                                                Sign In
                                            </button>
                                        </p>
                                    ) : (
                                        <p>
                                            Don't have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={toggleSignUp}
                                                className="hover:text-gray-900 transition duration-300 hover:underline"
                                            >
                                                Register
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
