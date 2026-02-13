import React from 'react';
import { FaTools, FaCog } from 'react-icons/fa';
import { APP_NAME } from './utils/constants';

const UnderMaintain = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6 text-center overflow-hidden relative">

            {/* Background Decorative Elements (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-800/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto">
                {/* Animated Icons */}
                <div className="relative mb-8">
                    <div className="relative flex items-center justify-center">
                        {/* Outer gear */}
                        <FaCog className="text-9xl text-gray-800 animate-[spin_10s_linear_infinite]" />
                        {/* Inner tools */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FaTools className="text-5xl text-red-600 drop-shadow-lg" />
                        </div>
                    </div>
                </div>

                {/* Main Text */}
                {/* <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight mb-4">
                    Under Maintenance
                </h1> */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight mb-4">
                    Version 4.0 is Updating
                </h1>

                {/* <p className="text-lg md:text-xl text-gray-400 mt-5 mb-8 leading-relaxed max-w-md mx-auto">
                    We are currently performing scheduled maintenance to improve your experience. <br />
                    We'll be back shortly.
                </p> */}
                <p className="text-lg md:text-xl text-gray-400 mt-5 mb-8 leading-relaxed max-w-md mx-auto">
                    We're building something massive. <span className="text-white">ExamPoint 4.0</span> brings permanent leaderboards, enhanced results, and a good experience.
                </p>
            </div>

            {/* Footer Text */}
            <div className="absolute bottom-8 text-center">
                <p className="text-xs text-gray-500">
                    {APP_NAME} ExamPoint • Online Examination Platform
                </p>
                <p className="text-xs text-gray-600 mt-2">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default UnderMaintain;
