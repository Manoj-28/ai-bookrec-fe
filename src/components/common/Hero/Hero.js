import { useState } from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

export const HeroComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCommunityPopup, setShowCommunityPopup] = useState(false);
    const [showRecommendationsPopup, setShowRecommendationsPopup] = useState(false);
    const [showPersonalizationPopup, setShowPersonalizationPopup] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            // Check if query matches "top X [genre] books" pattern
            const match = searchQuery.match(/top\s(\d+)\s([a-zA-Z\s]+)\s?books?/i);
            let query = searchQuery;

            // If it's a "top X" query, modify the search to ensure consistent results
            if (match) {
                const [_, count, genre] = match;
                query = `top ${count} ${genre.trim()} books`;
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/llm/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();

            navigate("/results", {
                state: {
                    books: data.results,
                    isTopXQuery: !!match,
                    topXCount: match ? parseInt(match[1], 10) : 0
                }
            });

        } catch (error) {
            console.error("Error fetching search results: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchSubmit();
        }
    };

    return (
        <div id="webcrumbs">
            {/* Recommendations Popup */}
            {showRecommendationsPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Smart Recommendations</h3>
                            <button
                                onClick={() => setShowRecommendationsPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Our AI analyzes millions of books and your reading preferences to suggest perfect matches.
                            The more you use it, the smarter it gets at recommending books you'll love.
                        </p>
                        <button
                            onClick={() => setShowRecommendationsPopup(false)}
                            className="bg-[#ff5533] text-white px-4 py-2 rounded-lg w-full hover:bg-[#ff6644] transition"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Personalization Popup */}
            {showPersonalizationPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Personalized Selection</h3>
                            <button
                                onClick={() => setShowPersonalizationPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            We tailor recommendations based on your reading history, favorite genres, and even your mood.
                            Tell us what you're in the mood for and we'll find the perfect book for you.
                        </p>
                        <button
                            onClick={() => setShowPersonalizationPopup(false)}
                            className="bg-[#ff5533] text-white px-4 py-2 rounded-lg w-full hover:bg-[#ff6644] transition"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Community Popup */}
            {showCommunityPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Community Features</h3>
                            <button
                                onClick={() => setShowCommunityPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Our community features are coming soon! Stay tuned for exciting ways to connect with fellow readers.
                        </p>
                        <button
                            onClick={() => setShowCommunityPopup(false)}
                            className="bg-[#ff5533] text-white px-4 py-2 rounded-lg w-full hover:bg-[#ff6644] transition"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white p-4 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
                    {/* Left Column */}
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center">
                            AI-Powered Book Discovery 📚
                        </h1>
                        <p className="text-gray-600 mb-8 text-base sm:text-lg">
                            Let our AI find your perfect next read. Personalized recommendations based on your unique reading preferences and interests. Discover books that match your taste and expand your literary horizons.
                        </p>

                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition duration-200">
                                <span className="material-symbols-outlined text-gray-400 ml-4">search</span>
                                <input
                                    type="text"
                                    placeholder="Search books or describe what you'd like to read..."
                                    className="w-full p-4 bg-transparent outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Try: "top 5 science fiction books" or "best mystery novels"
                            </div>
                        </div>

                        {/* Explore Button */}
                        <button
                            onClick={handleSearchSubmit}
                            disabled={loading}
                            className="bg-[#ff5533] hover:bg-[#ff6644] text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition duration-200 flex items-center group shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    Explore Now
                                    <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Happy Readers Section */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/44.jpg"
                                        alt="Happy reader"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                                    <img
                                        src="https://randomuser.me/api/portraits/men/32.jpg"
                                        alt="Happy reader"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/68.jpg"
                                        alt="Happy reader"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                                    <img
                                        src="https://randomuser.me/api/portraits/men/75.jpg"
                                        alt="Happy reader"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/90.jpg"
                                        alt="Happy reader"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="font-bold text-lg">10K+ Happy Readers</h3>
                                <p className="text-sm text-gray-600">Join our growing AI-powered reading community</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Image) */}
                    <div className="w-full mt-8 md:mt-0 flex justify-center p-6">
                        <img
                            src="book-image.png"
                            alt="AI-powered reading experience"
                            className="w-full h-auto max-w-[800px] rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>
                {/* Features Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setShowRecommendationsPopup(true)}
                    >
                        <span className="material-symbols-outlined text-2xl text-[#ff5533]">auto_awesome</span>
                        <h3 className="font-semibold mt-2">Smart Recommendations</h3>
                        <p className="text-sm text-gray-600">Powered by advanced AI algorithms</p>
                    </div>
                    <div
                        className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setShowPersonalizationPopup(true)}
                    >
                        <span className="material-symbols-outlined text-2xl text-[#ff5533]">psychology</span>
                        <h3 className="font-semibold mt-2">Personalized Selection</h3>
                        <p className="text-sm text-gray-600">Tailored to your preferences</p>
                    </div>
                    <div
                        className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setShowCommunityPopup(true)}
                    >
                        <span className="material-symbols-outlined text-2xl text-[#ff5533]">diversity_3</span>
                        <h3 className="font-semibold mt-2">Active Community</h3>
                        <p className="text-sm text-gray-600">Connect with fellow readers</p>
                    </div>
                </div>
            </div>
        </div>
    );
};