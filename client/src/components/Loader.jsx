
const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gray-900 space-y-4">
            <div className="relative">
                {/* Main Spinning Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-green-500 animate-spin"></div>

                {/* Pulsating Inner Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full animate-ping"></div>
                </div>

                {/* Fixed Center Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                </div>
            </div>

            <p className="text-gray-300 text-sm font-medium tracking-[0.2em] uppercase animate-pulse">
                Loading...
            </p>
        </div>
    );
};

export default Loader;
