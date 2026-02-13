import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-900/20 text-blue-400',
        green: 'bg-green-900/20 text-green-400',
        purple: 'bg-purple-900/20 text-purple-400',
        indigo: 'bg-indigo-900/20 text-indigo-400',
        red: 'bg-red-900/20 text-red-400',
        yellow: 'bg-yellow-900/20 text-yellow-400',

    };

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-700">
            <div className={`p-4 rounded-full ${colorClasses[color] || 'bg-gray-700 text-gray-400'}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-100">{value}</p>
            </div>
        </div>
    );
};

export default DashboardCard;
