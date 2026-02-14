import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Notes = () => {
    const notesData = [
        {
            id: 1,
            title: 'Full Form Notes',
            description: 'Full form of all the topics related to computer and finance.',
            category: 'Full Form',
            link: 'https://drive.google.com/file/d/1ZYdmAB3AlRol90PQ9OiTQu8cRzjDbkZT/view?usp=drive_link',
        },
        {
            id: 2,
            title: 'Shortcut Keys Notes',
            description: 'All the shortcut keys of computer.',
            category: 'Shortcut Keys',
            link: 'https://drive.google.com/file/d/14yJ4MVfRJOtywFR-GNkru2_qn6CsNR13/view?usp=drive_link',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />
                <main className="flex-1 p-8 bg-gray-900 relative overflow-hidden mt-20">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-900/10 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-900/05 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-8">
                            <div>
                                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2">
                                    Notes
                                </h2>
                                <p className="text-gray-400 max-w-2xl">
                                    Download valuable study materials and notes provided by Institute to enhance your learning experience.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {notesData.map((note) => (
                                <div key={note.id} className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 flex flex-col hover:border-green-500/50 transition-all duration-300 group shadow-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                                {note.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-green-400 transition-colors">
                                            {note.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                            {note.description}
                                        </p>
                                    </div>
                                    <a
                                        href={note.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 px-4 bg-gray-700 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border border-gray-600 hover:border-green-500 hover:shadow-lg hover:shadow-green-600/20"
                                    >
                                        <span className="material-symbols-outlined text-xl">download</span>
                                        Download PDF
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 bg-gray-800/30 rounded-2xl p-8 border border-gray-800 text-center">
                            <span className="material-symbols-outlined text-gray-500 text-5xl mb-4">info</span>
                            <h3 className="text-xl font-bold text-gray-200 mb-2">Need More Materials?</h3>
                            <p className="text-gray-400 max-w-lg mx-auto">
                                If you're looking for specific notes that aren't listed here, please contact the institute office or your instructor.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Notes;
