import { useEffect, useState } from "react";
import "./DisplayBooks.css";
// import results from "./results.json";
import { useLocation } from "react-router-dom";
import { useBookmarks } from "../../context/BookmarkContext";

export const DisplayBooks = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [books, setBooks] = useState(location.state?.books || []);
    const [showResults, setShowResults] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [topXBooks, setTopXBooks] = useState(location.state?.topXCount || 0);
    const [visibleRows, setVisibleRows] = useState(1); // Track how many rows to show
    const [hasSearched, setHasSearched] = useState(false);
    const booksPerRow = 5; // Number of books per row

    useEffect(() => {
        setTimeout(() => setShowResults(true), 300);
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setHasSearched(true);
        try {
            const response = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/api/llm/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: searchQuery }),
            });
            // const data = results;
            const data = await response.json();

            if (data.results) {
                setBooks(data.results);
                // Reset visible rows when new search is performed
                setVisibleRows(1);
                // Check if query contains "top X" pattern
                const match = searchQuery.match(/top\s(\d+)/i);
                if (match) {
                    setTopXBooks(parseInt(match[1], 10));
                } else {
                    setTopXBooks(0);
                }
            }
        } catch (error) {
            console.error("Error fetching search results: ", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const loadMoreBooks = () => {
        setVisibleRows(prev => prev + 1);
    };

    // Calculate how many books to show
    const booksToShow = topXBooks > 0
        ? Math.min(books.length, topXBooks + (visibleRows - 1) * booksPerRow)
        : books.length;

    const displayedBooks = books.slice(0, booksToShow);

    return (
        <div id="webcrumbs">
            <div className="w-full p-4 md:p-8 bg-white">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold">AI-Powered Book Discovery</h1>
                        <span className="text-xl md:text-2xl">📚</span>
                    </div>

                    <p className="text-gray-600 max-w-xl">
                        Discover your next literary adventure with our AI-powered book recommendations.
                    </p>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search books or describe what you'd like to read..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearchSubmit();
                                }
                            }}
                        />
                        <button
                            onClick={handleSearchSubmit}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <span className="material-symbols-outlined text-gray-400 hover:text-gray-600 transition">
                                search
                            </span>
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}


                    {/* Main results section */}
                    {!isLoading && hasSearched && books.length > 0 && (
                        <>
                            {topXBooks > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-bold mb-4">Top {topXBooks} Results</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {displayedBooks.slice(0, topXBooks).map((book) => (
                                            <BookCard key={book.title} book={book} onClick={(book) => setSelectedBook(book)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Similar books section */}
                            {topXBooks > 0 && books.length > topXBooks && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-bold mb-4">Similar Books</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {displayedBooks.slice(topXBooks).map((book) => (
                                            <BookCard key={book.title} book={book} onClick={(book) => setSelectedBook(book)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Regular results (non-top X queries) */}
                            {topXBooks === 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                                    {displayedBooks.map((book) => (
                                        <BookCard key={book.title} book={book} onClick={(book) => setSelectedBook(book)} />
                                    ))}
                                </div>
                            )}

                            {/* Load More button */}
                            {booksToShow < books.length && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={loadMoreBooks}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        Load More Books
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
            {selectedBook && (<BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />)}
        </div>
    );
};

// Extracted BookCard component for better readability
export const BookCard = ({ book, onClick }) => {
    const { addBookmark, isAuthenticated } = useBookmarks();

    const handleBookmark = (e) => {
        e.stopPropagation();
        addBookmark(book);
    };


    return (
        <div className="group relative rounded-lg overflow-hidden cursor-pointer" onClick={() => onClick(book)}>
            <div className="relative rounded-lg overflow-hidden shoadow-md hover:shadow-xl transition duration-300">
                <img
                    src={book.thumbnail}
                    className="w-full aspect-[2/3] object-cover transform group-hover:scale-105 transition duration-300"
                    alt={book.title}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white text-sm font-semibold mb-1">{book.title}</h3>
                        <p className="text-gray-300 text-xs">By {book.author}</p>
                        {book.averageRating && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                <span className="text-gray-300 text-xs">{book.averageRating}</span>
                            </div>
                        )}
                        <p className="text-gray-300 text-xs mt-2 line-clamp-3">{book.description}</p>
                    </div>
                </div>
                <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                    }}
                >
                    <span className="material-symbols-outlined text-red-500">favorite</span>
                </button>
            </div>
            <div className="mt-3 flex justify-between items-start">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 flex-1 pr-2">{book.title}</h3>
                <button
                    className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-colors duration-200 group-hover:shadow-sm"
                    title="Add to wishlist"
                    onClick={handleBookmark}
                >
                    <span className="material-symbols-outlined text-blue-600 text-sm">bookmark_add</span>
                </button>


            </div>
        </div>
    )
};


const BookDetailsModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">{book.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={book.thumbnail}
                                alt={book.title}
                                className="w-48 h-64 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-700 mb-2"><strong>Author:</strong> {book.author}</p>
                            <p className="text-gray-700 mb-2"><strong>Published:</strong> {book.publishedDate} by {book.publisher}</p>
                            <p className="text-gray-700 mb-2"><strong>Pages:</strong> {book.pageCount}</p>
                            <p className="text-gray-700 mb-2"><strong>Language:</strong> {book.language}</p>

                            {book.averageRating && (
                                <div className="flex items-center mb-2">
                                    <strong className="mr-2">Rating:</strong>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`material-symbols-outlined ${i < Math.floor(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                                {i < book.averageRating ? 'star' : 'star'}
                                            </span>
                                        ))}
                                        <span className="ml-1 text-sm text-gray-600">
                                            ({book.ratingsCount} ratings)
                                        </span>
                                    </div>
                                </div>
                            )}

                            {book.categories && (
                                <div className="mb-4">
                                    <strong>Categories:</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {book.categories.map((category, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <strong>Description:</strong>
                                <p className="mt-1 text-gray-700">{book.description}</p>
                            </div>

                            {book.previewLink && (
                                <a
                                    href={book.previewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Preview Book
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
