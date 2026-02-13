import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center text-gray-400 text-sm font-medium bg-gray-700/50 px-4 py-2 rounded-full border border-gray-600/50 ml-4">
            <span className="material-symbols-outlined text-sm mr-2">schedule</span>
            {time.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }).toUpperCase()}
        </div>
    );
};

export default Clock;
