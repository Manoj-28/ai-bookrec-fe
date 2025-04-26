import { createContext, useContext, useState } from 'react';

const BookmarkContext = createContext({
    bookmarks: [],
    addBookmark: () => {},
    removeBookmark: () => {},
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
  });
  
  

export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const addBookmark = (book) => {
        if (!isAuthenticated) return false;
        setBookmarks(prev => [...prev, book]);
        return true;
    };

    const removeBookmark = (bookId) => {
        setBookmarks(prev => prev.filter(b => b.title !== bookId));
    };

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isAuthenticated, login, logout }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
      throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
  };
  