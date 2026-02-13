import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME, APP_VERSION } from '../utils/constants';

const Sidebar = () => {
    const location = useLocation();

    const session = JSON.parse(localStorage.getItem('session') || '{}');
    const isGuest = session.type === 'guest';

    const isActive = (path) => {
        return location.pathname === path ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white';
    };

    return (
        <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 z-20 shadow-xl flex flex-col border-r border-gray-800">
            <div className="h-20 flex items-center px-8 border-b border-gray-800 bg-gray-900">
                <span className="text-2xl font-bold text-red-600 tracking-tighter"> {APP_NAME} <span className="text-white"> ExamPoint</span></span>
            </div>
            <div className="flex-1 py-4">
                <nav className="space-y-1">
                    <Link
                        to="/"
                        className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/')}`}
                    >
                        <span className="material-symbols-outlined mr-3 text-xl">dashboard</span>
                        Dashboard
                    </Link>
                    <Link
                        to="/exams"
                        className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/exams')}`}
                    >
                        <span className="material-symbols-outlined mr-3 text-xl">assignment</span>
                        All Exam
                    </Link>

                    {!isGuest && (
                        <>
                            <Link
                                to="/ccc-exams"
                                className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/ccc-exams')}`}
                            >
                                <span className="material-symbols-outlined mr-3 text-xl">assignment</span>
                                CCC
                            </Link>
                            <Link
                                to="/adca-exams"
                                className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/adca-exams')}`}
                            >
                                <span className="material-symbols-outlined mr-3 text-xl">assignment</span>
                                ADCA
                            </Link>
                            <Link
                                to="/o-level-exams"
                                className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/o-level-exams')}`}
                            >
                                <span className="material-symbols-outlined mr-3 text-xl">assignment</span>
                                O Level
                            </Link>
                            <Link
                                to="/class-tests"
                                className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/class-tests')}`}
                            >
                                <span className="material-symbols-outlined mr-3 text-xl">school</span>
                                Class Tests
                            </Link>
                            <Link
                                to="/notes"
                                className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/notes')}`}
                            >
                                <span className="material-symbols-outlined mr-3 text-xl">description</span>
                                Notes
                            </Link>
                        </>
                    )}
                    <Link
                        to="/leaderboard"
                        className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive('/leaderboard')}`}
                    >
                        <span className="material-symbols-outlined mr-3 text-xl">emoji_events</span>
                        Leaderboard
                    </Link>
                </nav>
            </div>

            {/* About Section */}
            <div className="p-4 border-t border-gray-800 space-y-2">
                {!isGuest && (
                    <Link
                        to="/feedback"
                        className={`flex items-center justify-center w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive('/feedback') ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined mr-2 text-lg">feedback</span>
                        Feedback
                    </Link>
                )}
                <Link
                    to="/about"
                    className={`flex items-center justify-center w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive('/about') ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined mr-2 text-lg">info</span>
                    About Institute
                </Link>
                <div className="text-center mt-4 text-xs text-gray-600">
                    Version {APP_VERSION}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
