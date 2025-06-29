import React, { useState, useEffect } from "react";
import "./Suggestions.css";
import { useBookmarks } from "../../context/BookmarkContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export const Suggestions = () => {
    const [genre, setGenre] = useState("Fiction");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleRows, setVisibleRows] = useState(1);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const booksPerRow = 5;
    const { addBookmark, removeBookmark } = useBookmarks();
    const { user } = useAuth();

    const fetchBooks = async (selectedGenre) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/llm/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: `top ${selectedGenre} books` }),
            });
            const data = await response.json();
            setBooks(data.results || []);
            setVisibleRows(1);
        } catch (error) {
            console.error("Error fetching books:", error);
            toast.error("Failed to fetch books");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(genre);
    }, [genre]);

    const handleGenreClick = (selectedGenre) => {
        setGenre(selectedGenre);
    };

    const loadMoreBooks = () => {
        setVisibleRows(prev => prev + 1);
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleBookmark = async (e, book) => {
        e.stopPropagation();
        setBookmarkLoading(true);
        
        if (!user) {
            toast.info("Please log in to bookmark books");
            setBookmarkLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    book: book,
                    category: 'general'
                })
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            addBookmark(book);
            toast.success("Book added to your wishlist!");
        } catch (error) {
            console.error("Bookmark error:", error);
            toast.error(error.message || "Failed to bookmark");
        } finally {
            setBookmarkLoading(false);
        }
    };

    const booksToShow = visibleRows * booksPerRow;
    const displayedBooks = books.slice(0, booksToShow);

    return (
        <div id="webcrumbs">
            <div className="w-full p-4 md:p-8 bg-white">
                <div className="flex flex-col gap-6">
                    {/* Genre buttons */}
                    <div className="flex flex-wrap gap-3">
                        {["Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", "Fantasy"].map((g) => (
                            <button
                                key={g}
                                className={`px-4 py-2 rounded-full ${genre === g ? "bg-blue-500 text-white" : "bg-gray-200"
                                    } hover:bg-blue-300 transition duration-200`}
                                onClick={() => handleGenreClick(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Popular in {genre}</h2>
                    </div>

                    {/* Books grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {displayedBooks.map((book) => (
                            <BookCard 
                                key={book.title} 
                                book={book} 
                                onClick={handleBookClick}
                                onBookmark={handleBookmark}
                                user={user}
                                loading={bookmarkLoading}
                            />
                        ))}
                    </div>

                    {/* Load more button */}
                    {booksToShow < books.length && (
                        <div className="flex justify-center mt-4">
                            <button 
                                onClick={loadMoreBooks}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    "Loading..."
                                ) : (
                                    <>
                                        <span>Load More Books</span>
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Book details modal */}
            {selectedBook && (
                <BookDetailsModal 
                    book={selectedBook} 
                    onClose={() => setSelectedBook(null)}
                    user={user}
                    onBookmark={handleBookmark}
                    loading={bookmarkLoading}
                />
            )}
        </div>
    );
};

// BookCard component
const BookCard = ({ book, onClick, onBookmark, user, loading }) => {
    return (
        <div 
            className="group flex flex-col cursor-pointer"
            onClick={() => onClick(book)}
        >
            <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                <img
                    src={book.thumbnail}
                    className="w-full aspect-[2/3] object-cover transform group-hover:scale-105 transition duration-300"
                    alt={book.title}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
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
            </div>
            <div className="mt-3 flex justify-between items-start">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 flex-1 pr-2">{book.title}</h3>
                <button 
                    className={`flex-shrink-0 ${loading ? 'bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'} p-1.5 rounded-full transition-colors duration-200 group-hover:shadow-sm`}
                    title={user ? "Add to bookmarks" : "Sign in to bookmark"}
                    onClick={(e) => onBookmark(e, book)}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="material-symbols-outlined text-gray-400 text-sm">hourglass_top</span>
                    ) : (
                        <span className="material-symbols-outlined text-blue-600 text-sm">
                            {user ? 'bookmark_add' : 'lock'}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

// BookDetailsModal component
const BookDetailsModal = ({ book, onClose, user, onBookmark, loading }) => {
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
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-700 mb-2"><strong>Author:</strong> {book.author}</p>
                            {book.publishedDate && (
                                <p className="text-gray-700 mb-2"><strong>Published:</strong> {book.publishedDate}</p>
                            )}
                            {book.publisher && (
                                <p className="text-gray-700 mb-2"><strong>Publisher:</strong> {book.publisher}</p>
                            )}
                            {book.pageCount && (
                                <p className="text-gray-700 mb-2"><strong>Pages:</strong> {book.pageCount}</p>
                            )}
                            {book.language && (
                                <p className="text-gray-700 mb-2"><strong>Language:</strong> {book.language}</p>
                            )}

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
                                        {book.ratingsCount && (
                                            <span className="ml-1 text-sm text-gray-600">
                                                ({book.ratingsCount} ratings)
                                            </span>
                                        )}
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

                            <div className="flex gap-3">
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
                                <button
                                    onClick={(e) => onBookmark(e, book)}
                                    disabled={loading}
                                    className={`inline-flex items-center gap-2 ${loading ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2 rounded transition`}
                                >
                                    {loading ? (
                                        <span className="material-symbols-outlined text-gray-400">hourglass_top</span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-blue-600">
                                                {user ? 'bookmark_add' : 'lock'}
                                            </span>
                                            {user ? 'Add to Bookmarks' : 'Sign in to Bookmark'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};