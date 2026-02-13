import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { getExams, getUserResults } from '../../services/examApi';

const ExamList = ({ category }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [completedExams, setCompletedExams] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {

                const { data } = await getExams({ category });
                // Sort by _id ascending (oldest first / FIFO)
                // Assuming _id is a reliable proxy for creation time if createdAt isn't available
                // If createdAt exists, use: .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                const sorted = [...data].sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    }
                    return a._id.localeCompare(b._id);
                });

                // Filter out expired exams (students shouldn't see them)
                const now = new Date();
                const activeExams = sorted.filter(exam => {
                    if (!exam.endTime) return true; // No end time = always active
                    return new Date(exam.endTime) > now; // Only show if not expired
                });

                setExams(activeExams);

                // Load completed exams from both database and localStorage
                const sessionStr = localStorage.getItem('session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    const COMPLETED_KEY = `completed_exams_${session.regNo}`;

                    // Fetch from localStorage (backward compatibility)
                    const localCompleted = JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');

                    // Fetch from database (cross-browser support)
                    let dbCompleted = [];
                    if (session.sessionId) {
                        try {
                            const { data: results } = await getUserResults(session.sessionId);
                            // Transform results to our format
                            dbCompleted = results.map(result => ({
                                examId: result.examId._id || result.examId, // Ensure it's a string ID
                                resultId: result._id,
                                score: result.score,
                                totalQuestions: result.totalQuestions,
                                percentage: result.totalQuestions > 0
                                    ? Math.round((result.score / result.totalQuestions) * 100)
                                    : 0
                            }));
                        } catch (err) {
                            console.error('Failed to fetch user results:', err);
                        }
                    }

                    // Merge both sources (database takes priority)
                    const mergedCompleted = [...dbCompleted];

                    // Add localStorage items that aren't in database
                    localCompleted.forEach(localItem => {
                        const examId = typeof localItem === 'object' ? localItem.examId : localItem;
                        const alreadyExists = dbCompleted.some(dbItem => dbItem.examId === examId);
                        if (!alreadyExists) {
                            mergedCompleted.push(localItem);
                        }
                    });

                    setCompletedExams(mergedCompleted);
                }
            } catch (err) {
                setError("Failed to load exams.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();

        // Update timer every second
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [category]);

    const formatTimeRemaining = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

    const getExamStatus = (exam) => {
        const now = currentTime;
        const start = exam.startTime ? new Date(exam.startTime) : null;
        const end = exam.endTime ? new Date(exam.endTime) : null;

        if (start && now < start) {
            return {
                label: `Starts in: ${formatTimeRemaining(start - now)}`,
                canStart: false,
                color: 'text-orange-600 bg-orange-50'
            };
        }

        if (end && now > end) {
            return {
                label: 'Exam Ended',
                canStart: false,
                color: 'text-red-600 bg-red-50'
            };
        }

        if (end) {
            return {
                label: `Ends in: ${formatTimeRemaining(end - now)}`,
                canStart: true,
                color: 'text-green-600 bg-green-50'
            };
        }

        return { label: 'Available', canStart: true, color: 'text-green-600 bg-green-50' };
    };

    if (loading) return <div className="p-10"><Loader /></div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Navbar />
            <Sidebar />
            <main className="ml-64 mt-20 p-10 bg-gray-900 min-h-[calc(100vh-5rem)]">
                <h2 className="text-3xl font-bold text-gray-100 mb-6">{category === 'Class Test' ? 'Class Tests' : 'Available Exams'}</h2>

                {error && <div className="text-red-600 mb-4">{error}</div>}

                {exams.length === 0 && !error ? (
                    <div className="text-gray-400">No exams available at the moment.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => {
                            const status = getExamStatus(exam);
                            return (
                                <div key={exam._id} className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-700 flex flex-col justify-between group hover:border-red-500/50">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-100 group-hover:text-red-400 transition-colors">{exam.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 mb-4 line-clamp-3">{exam.description}</p>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <span className="mr-4 flex items-center">
                                                <span className="material-symbols-outlined text-sm mr-1">timer</span>
                                                {exam.timeLimitMinutes} mins
                                            </span>
                                        </div>
                                    </div>
                                    {(() => {
                                        // Find the completed exam data
                                        const completedData = completedExams.find(item =>
                                            typeof item === 'object' ? item.examId === exam._id : item === exam._id
                                        );

                                        if (completedData) {
                                            // Handle both old format (just ID) and new format (object with data)
                                            const hasResultData = typeof completedData === 'object' && completedData.percentage !== undefined;

                                            return (
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled
                                                        className="flex-1 text-center bg-green-800 text-green-200 font-bold py-2 px-4 rounded cursor-not-allowed border border-green-700 flex items-center justify-center"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-2">check_circle</span>
                                                        {hasResultData ? `Score: ${completedData.percentage}%` : 'Completed'}
                                                    </button>
                                                    {hasResultData && completedData.resultId && (
                                                        <Link
                                                            to={`/result/${completedData.resultId}`}
                                                            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-sm mr-2">visibility</span>
                                                            View Result
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        } else if (status.canStart) {
                                            return (
                                                <Link
                                                    to={
                                                        exam.securityEnabled
                                                            ? (exam.hasSecurityKey ? `/exams/${exam._id}/security-check` : `/exams/${exam._id}/instructions`)
                                                            : `/exams/${exam._id}`
                                                    }
                                                    className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined mr-2">
                                                        {exam.securityEnabled ? (exam.hasSecurityKey ? 'lock' : 'shield') : 'play_arrow'}
                                                    </span>
                                                    {exam.securityEnabled ? (exam.hasSecurityKey ? 'Enter Key' : 'Start Exam') : 'Start Exam'}
                                                </Link>
                                            );
                                        } else {
                                            return (
                                                <button
                                                    disabled
                                                    className="block w-full text-center bg-gray-700 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed border border-gray-600 flex items-center justify-center"
                                                >
                                                    {status.label.includes('Starts') ? (
                                                        <>
                                                            <span className="material-symbols-outlined text-sm mr-2">schedule</span>
                                                            Starts at {new Date(exam.startTime).toLocaleString()}
                                                        </>
                                                    ) : status.label.includes('Ended') ? (
                                                        <>
                                                            <span className="material-symbols-outlined text-sm mr-2">event_busy</span>
                                                            Ended
                                                        </>
                                                    ) : (
                                                        'Not Started'
                                                    )}
                                                </button>
                                            );
                                        }
                                    })()}
                                </div>
                            );
                        })}
                    </div>
                )
                }
            </main >
        </div >
    );
};

export default ExamList;
