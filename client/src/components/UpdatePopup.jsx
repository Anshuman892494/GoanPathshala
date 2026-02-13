import React from 'react';

const UpdatePopup = ({ onClose, content }) => {
    if (!content) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-scaleUp">

                {/* Header with decorative background */}
                <div className="bg-gradient-to-r from-red-900/40 to-gray-800 p-6 border-b border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-500 text-3xl bg-red-500/10 p-2 rounded-lg">campaign</span>
                        <h2 className="text-xl font-bold text-white tracking-wide">{content.title}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <ul className="space-y-4">
                        {content.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <span className="material-symbols-outlined text-green-400 text-sm mt-1 bg-green-400/10 rounded-full p-0.5 group-hover:bg-green-400/20 transition-colors">check</span>
                                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-900/40 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
                    >
                        <span>Got it, thanks!</span>
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePopup;
