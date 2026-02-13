import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6 text-center">
            <h1 className="text-6xl font-extrabold text-red-600 mb-2">404</h1>

            <p className="text-gray-300 text-xl mb-4">
                Oops! Page not found
            </p>

            <p className="text-gray-500 text-sm max-w-md mb-8">
                The page you are looking for doesn’t exist or may have been moved.
            </p>

            <Link
                to="/"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
                Go back to Dashboard
            </Link>

            <p className="text-xs text-gray-500 mt-8">
                {APP_NAME} • Online Examination Platform
            </p>
        </div>
    );
};

export default NotFound;
