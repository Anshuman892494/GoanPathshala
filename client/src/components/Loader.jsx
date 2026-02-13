
const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center h-full w-full min-h-[50vh] space-y-4">
            <div className="relative">
                {/* Main Spinning Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-red-600 animate-spin"></div>

                {/* Pulsating Inner Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600/20 rounded-full animate-ping"></div>
                </div>

                {/* Fixed Center Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                </div>
            </div>

            <p className="text-gray-500 text-sm font-medium tracking-[0.2em] uppercase animate-pulse">
                Loading...
            </p>
        </div>
    );
};

export default Loader;
