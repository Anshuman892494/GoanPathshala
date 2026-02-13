import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getResultById } from '../../services/examApi';

const Result = ({ isAdmin = false }) => {
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'correct', 'incorrect'

    useEffect(() => {
        const fetchResult = async () => {
            try {
                // If isAdmin is true, we might need a different API call if the standard one checks for user session matching
                // However, getResultById usually just fetches by ID. If backend protects it by user, we need an admin endpoint.
                // Let's assume getResultById works or we'll use getAdminResultById if needed. 
                // Wait, examApi.js has getResultById. Let's check backend... result.routes.js... 
                // It likely protects by user.
                // WE NEED TO CHECK IF getResultById works for admin. 
                // Actually examApi.js has `getAdminResults` but not `getAdminResultById`. 
                // I should probably add `getAdminResultById` to be safe, or direct to `getResultById` if it allows admins.
                // For now, let's try using the same, but if it fails, we know why.
                // ACTUALLY, I should add `getAdminResultById` to be sure.

                // Converting to use a specific admin fetch if isAdmin is true would be safer.
                // But let's look at `examApi.js` again. 
                // `export const getResultById = (id) => api.get(\`/results/${id}\`);`
                // Backend `router.get('/:id', protect, getResult);`
                // `getResult` likely checks `req.user._id`. Admin is a different collection/logic.
                // So I need `getAdminResultById` in backend and frontend!

                // Let's stick to the plan: I will add `getAdminResultById` to `examApi.js` and backend `admin.controller.js` / `admin.routes.js`.
                // Reserving this file edit to getting props mostly. 

                const { data } = isAdmin
                    ? await import('../../services/examApi').then(module => module.getAdminResultById(resultId))
                    : await getResultById(resultId);
                setResult(data);
            } catch (error) {
                console.error("Failed to fetch result", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [resultId, isAdmin]);

    if (loading) return <div className="ml-64 mt-20 p-10"><Loader /></div>;
    if (!result) return <div className="ml-64 mt-20 p-10">Result not found</div>;

    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    let feedbackColor = 'text-gray-600';
    let feedbackText = 'Completed';

    if (percentage >= 80) {
        feedbackColor = 'text-green-500';
        feedbackText = 'Excellent!';
    } else if (percentage >= 50) {
        feedbackColor = 'text-blue-500';
        feedbackText = 'Good Job!';
    } else {
        feedbackColor = 'text-red-500';
        feedbackText = 'Needs Improvement';
    }

    const filteredAnswers = result.answers ? result.answers.filter(ans => {
        if (filter === 'correct') return ans.isCorrect;
        if (filter === 'incorrect') return !ans.isCorrect;
        return true;
    }) : [];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">

                {/* Left Column: Summary Card */}
                <div className="w-full md:w-1/3 shrink-0 flex flex-col h-full overflow-hidden">
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 flex flex-col h-full overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-8 py-10 text-center shrink-0 border-b border-gray-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-600/50"></div>
                            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Exam Results</h2>
                            <p className="text-gray-400 font-medium text-lg">{result.examTitle}</p>
                            {/* Student Info for Admin */}
                            {isAdmin && result.sessionId && (
                                <div className="mt-2 p-2 bg-gray-700/50 rounded-lg text-sm">
                                    <p className="text-white font-bold">{result.sessionId.name}</p>
                                    <p className="text-gray-400">{result.sessionId.regNo}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-8">
                            {/* Percentage Circle */}
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-gray-700"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 88}
                                        strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
                                        className={feedbackColor}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-black tracking-tighter ${feedbackColor}`}>
                                        {percentage}%
                                    </span>
                                    <span className={`text-sm font-bold uppercase tracking-wide mt-1 ${feedbackColor}`}>{feedbackText}</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700 text-center">
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-2xl font-black text-white">{result.totalQuestions}</p>
                                </div>
                                <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20 text-center">
                                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Attempted</p>
                                    <p className="text-2xl font-black text-blue-100">{result.correct + result.wrong}</p>
                                </div>
                                <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20 text-center">
                                    <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">Correct</p>
                                    <p className="text-2xl font-black text-green-100">{result.correct}</p>
                                </div>
                                <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20 text-center">
                                    <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Wrong</p>
                                    <p className="text-2xl font-black text-red-100">{result.wrong}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Analysis */}
                <div className="w-full md:w-2/3 h-full overflow-hidden flex flex-col bg-gray-800 rounded-2xl shadow-xl border border-gray-700">

                    {/* Sticky Header with Filters */}
                    <div className="p-6 border-b border-gray-700 bg-gray-800 shrink-0 z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <span className="material-symbols-outlined mr-2 text-red-500">analytics</span>
                                Question Analysis
                            </h3>

                            <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-700">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`flex items-center px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                >
                                    All <span className="ml-2 bg-gray-800 px-1.5 rounded-full text-xs">{result.answers ? result.answers.length : 0}</span>
                                </button>
                                <button
                                    onClick={() => setFilter('correct')}
                                    className={`flex items-center px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${filter === 'correct' ? 'bg-green-900/40 text-green-300 shadow' : 'text-gray-400 hover:text-green-300'}`}
                                >
                                    Correct <span className="ml-2 bg-green-900/60 px-1.5 rounded-full text-xs">{result.correct}</span>
                                </button>
                                <button
                                    onClick={() => setFilter('incorrect')}
                                    className={`flex items-center px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${filter === 'incorrect' ? 'bg-red-900/40 text-red-300 shadow' : 'text-gray-400 hover:text-red-300'}`}
                                >
                                    Incorrect <span className="ml-2 bg-red-900/60 px-1.5 rounded-full text-xs">{result.wrong}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-900/30">
                        {filteredAnswers.length > 0 ? (
                            filteredAnswers.map((ans, index) => {
                                const question = ans.questionId;
                                if (!question) return null;

                                return (
                                    <div key={index} className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm hover:border-gray-600 transition-all group">
                                        {/* Question */}
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-base font-medium text-gray-200 flex-1 pr-4 leading-relaxed">
                                                <span className="text-gray-500 mr-2 font-mono text-sm">Q{index + 1}.</span>
                                                {question.text}
                                            </h4>
                                            {ans.isCorrect ? (
                                                <span className="shrink-0 material-symbols-outlined text-green-500">check_circle</span>
                                            ) : (
                                                <span className="shrink-0 material-symbols-outlined text-red-500">cancel</span>
                                            )}
                                        </div>
                                        {/* Options */}
                                        <div className="space-y-2.5 ml-0 sm:ml-7">
                                            {question.options.map((option, optIndex) => {
                                                const isSelected = optIndex === ans.selectedIndex;
                                                const isCorrect = optIndex === question.correctIndex;

                                                let optionClass = "p-3 rounded-lg border text-sm transition-all flex items-center ";
                                                if (isCorrect) {
                                                    optionClass += "bg-green-900/10 border-green-500/30 text-green-200";
                                                } else if (isSelected && !ans.isCorrect) {
                                                    optionClass += "bg-red-900/10 border-red-500/30 text-red-200";
                                                } else {
                                                    optionClass += "bg-gray-900/40 border-gray-700/50 text-gray-400";
                                                }

                                                return (
                                                    <div key={optIndex} className={optionClass}>
                                                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 shrink-0 ${isCorrect ? 'bg-green-500 text-white shadow-sm' : isSelected ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-700 text-gray-500'}`}>
                                                            {String.fromCharCode(65 + optIndex)}
                                                        </span>
                                                        <span className="flex-1">{option}</span>
                                                        {isCorrect && <span className="text-xs font-bold uppercase ml-2 text-green-500 px-2 py-0.5 bg-green-900/30 rounded">Correct</span>}
                                                        {isSelected && !isCorrect && <span className="text-xs font-bold uppercase ml-2 text-red-500 px-2 py-0.5 bg-red-900/30 rounded">Your Answer</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                                <span className="material-symbols-outlined text-5xl mb-2">find_in_page</span>
                                <p>No questions match this filter</p>
                            </div>
                        )}
                    </div>
                    {/* Fixed Footer */}
                    <div className="p-4 border-t border-gray-700 bg-gray-800 shrink-0 z-10 rounded-b-2xl flex justify-center gap-4">
                        <Link
                            to={isAdmin ? "/admin/dashboard" : "/exams"}
                            className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                        >
                            <span className="material-symbols-outlined mr-2">arrow_back</span>
                            {isAdmin ? "Back to Dashboard" : "Back to Exams"}
                        </Link>

                        {!isAdmin && !result.examId?.securityEnabled && (
                            <Link
                                to={`/exams/${result.examId?._id || result.examId}`}
                                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                            >
                                <span className="material-symbols-outlined mr-2">refresh</span>
                                Retake Exam
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2);
                }
            `}</style>
        </div >
    );
};

export default Result;
