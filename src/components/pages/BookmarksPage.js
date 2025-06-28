import  { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';

export const BookmarksPage = ({ openProfile }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const { user, login } = useAuth();

    const fetchBookmarks = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/api/wishlist`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookmarks');
            }

            const result = await response.json();
            
            if (result.success && Array.isArray(result.data)) {
                const formattedBookmarks = result.data.map(item => ({
                    ...item.book,
                    wishlistId: item._id
                }));
                setBookmarks(formattedBookmarks);
            } else {
                setBookmarks([]);
                toast.warning('No bookmarks found');
            }
        } catch (error) {
            toast.error(error.message);
            setBookmarks([]);
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (wishlistId) => {
        setBookmarkLoading(true);
        try {
            const response = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/api/wishlist/${wishlistId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove bookmark');
            }

            toast.success('Bookmark removed');
            fetchBookmarks();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in to view your bookmarked books.
                    </p>
                    <button
                        onClick={openProfile} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 md:p-8 bg-white min-h-[80vh]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">Your Bookmarked Books</h1>
                    <span className="text-gray-500">
                        {bookmarks.length} {bookmarks.length === 1 ? 'book' : 'books'}
                    </span>
                </div>
                
                {bookmarks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-gray-400 text-4xl">
                                bookmark
                            </span>
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No books bookmarked yet
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            When you bookmark books, they'll appear here for easy access.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {bookmarks.map(book => (
                            <BookCard 
                                key={book.wishlistId} 
                                book={book} 
                                onClick={handleBookClick}
                                onBookmark={removeBookmark}
                                user={user}
                                loading={bookmarkLoading}
                                isBookmarked={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedBook && (
                <BookDetailsModal 
                    book={selectedBook} 
                    onClose={() => setSelectedBook(null)}
                    user={user}
                    onBookmark={(e, book) => {
                        e.stopPropagation();
                        removeBookmark(book.isbn);
                    }}
                    loading={bookmarkLoading}
                    isBookmarked={true}
                />
            )}
        </div>
    );
};

// BookCard component (should be in a separate file)
const BookCard = ({ book, onClick, onBookmark, user, loading, isBookmarked }) => {
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
                    title={isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onBookmark(book.isbn);
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="material-symbols-outlined text-gray-400 text-sm">hourglass_top</span>
                    ) : (
                        <span className="material-symbols-outlined text-blue-600 text-sm">
                            {isBookmarked ? 'bookmark_remove' : 'bookmark_add'}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

// BookDetailsModal component (should be in a separate file)
const BookDetailsModal = ({ book, onClose, user, onBookmark, loading, isBookmarked }) => {
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
                                                {isBookmarked ? 'bookmark_remove' : 'bookmark_add'}
                                            </span>
                                            {isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
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