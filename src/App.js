import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfilePage } from './components/pages/ProfilePage';
import { Home } from "./components/pages/Home";
import { DisplayBooks } from './components/common/DisplayBooks/DisplayBooks';
import { AuthProvider } from './components/context/AuthContext';
import { NavBar } from './components/common/NavBar/NavBar';
import { BookmarksPage } from './components/pages/BookmarksPage';



function App() {
    const [isProfileOpen, setProfileOpen] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <NavBar isProfileOpen={isProfileOpen} setProfileOpen={setProfileOpen} />
                <Routes>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/" element={<Home />} />
                    <Route path="/results" element={<DisplayBooks />} />
                    <Route path="/bookmarks" element={<BookmarksPage openProfile={() => setProfileOpen(true)} />}/>
                </Routes>
            </Router>
        </AuthProvider>

    );
}

export default App;