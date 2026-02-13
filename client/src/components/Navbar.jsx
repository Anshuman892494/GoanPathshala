import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME, UPDATE_POPUP_VERSION, UPDATE_POPUP_CONTENT } from '../utils/constants';
import Clock from './Clock';
import UpdatePopup from './UpdatePopup';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const sessionStr = localStorage.getItem('session');
    const user = sessionStr ? JSON.parse(sessionStr) : null;

    // Update Popup Logic
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [hasNewUpdate, setHasNewUpdate] = useState(false);

    useEffect(() => {
        // Red Dot Logic: Check if version has changed
        const lastSeenVersion = localStorage.getItem('lastSeenUpdateVersion');
        if (lastSeenVersion !== UPDATE_POPUP_VERSION) {
            setHasNewUpdate(true);
        }

        // Popup Logic: Show once per session on login
        const hasShownSessionPopup = sessionStorage.getItem('hasShownSessionPopup');
        if (user && !hasShownSessionPopup) {
            setShowUpdatePopup(true);
            sessionStorage.setItem('hasShownSessionPopup', 'true');
        }
    }, [user]); // Re-run when user logs in

    const handleClosePopup = () => {
        setShowUpdatePopup(false);
        setHasNewUpdate(false);
        localStorage.setItem('lastSeenUpdateVersion', UPDATE_POPUP_VERSION);
    };

    const handleBellClick = () => {
        setShowUpdatePopup(true);
        // If it was a new update, mark it as seen when clicked
        if (hasNewUpdate) {
            setHasNewUpdate(false);
            localStorage.setItem('lastSeenUpdateVersion', UPDATE_POPUP_VERSION);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout? All data will be cleared.")) {
            localStorage.removeItem('session');
            navigate('/login');
        }
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <nav className="bg-gray-800 shadow-lg px-8 py-5 flex justify-between items-center fixed top-0 left-64 right-0 z-50 h-20 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                Student

                {/* Notification Bell */}
                <button
                    onClick={handleBellClick}
                    className="relative p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors group"
                    title="Updates & Notifications"
                >
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-white transition-colors">notifications</span>
                    {hasNewUpdate && (
                        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800 animate-pulse"></span>
                    )}
                </button>
            </h1>

            {/* Update Popup Modal */}
            {showUpdatePopup && (
                <UpdatePopup
                    onClose={handleClosePopup}
                    content={UPDATE_POPUP_CONTENT}
                />
            )}

            <div className="flex items-center space-x-8">
                <div className="flex items-center">
                    <div className="hidden md:flex items-center text-gray-400 text-sm font-medium bg-gray-700/50 px-4 py-2 rounded-full border border-gray-600/50">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_month</span>
                        {formatDate()}
                    </div>
                    <Clock />
                </div>

                {user && (
                    <div className="flex items-center space-x-4 pl-4 border-l border-gray-700">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-gray-200 font-bold text-sm tracking-wide">{user.name}</span>
                            <span className="text-gray-500 text-xs font-mono">Reg: {user.regNo || 'N/A'}</span>
                        </div>
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold border border-red-500/30 text-lg shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-700 hover:bg-red-600/20 text-red-500 hover:text-red-400 text-sm px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center"
                        >
                            <span className="material-symbols-outlined text-sm mr-1">logout</span>
                            Logout
                        </button>
                    </div>
                )}
                {!user && (
                    <span className="text-gray-400">Student</span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
