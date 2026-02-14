import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getExamById, submitExam } from '../../services/examApi';
import { APP_NAME } from '../../utils/constants';

const ExamAttempt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
    const answersRef = useRef({}); // Ref to track latest answers for event listeners
    const handleSubmitRef = useRef(null); // Ref to track latest handleSubmit
    const submittingRef = useRef(false); // Ref to bypass validations during submission
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Security States
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(true);
    const [warningCount, setWarningCount] = useState(0);

    // Initial Warning Count Fetch
    useEffect(() => {
        if (!exam) return;
        const WARNING_KEY = `exam_warnings_${id}_${exam._id}`;
        const storedWarnings = localStorage.getItem(WARNING_KEY);
        if (storedWarnings) {
            setWarningCount(parseInt(storedWarnings, 10));
        }
    }, [exam, id]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const { data } = await getExamById(id);
                const examData = data.exam;
                let questionsData = data.questions;

                setExam(examData);

                // Handle Randomization
                if (examData.randomizeQuestions) {
                    const SHUFFLE_KEY = `shuffled_questions_${id}_${examData._id}`;
                    const savedOrder = localStorage.getItem(SHUFFLE_KEY);

                    if (savedOrder) {
                        const orderIndices = JSON.parse(savedOrder);
                        // Map original questions to the saved shuffled order
                        const shuffled = orderIndices.map(idx => questionsData[idx]).filter(q => q !== undefined);
                        // If question count changed (e.g. admin edited), we might need to fallback or merge.
                        // For simplicity, if lengths match, use saved order. Otherwise reshuffle.
                        if (shuffled.length === questionsData.length) {
                            questionsData = shuffled;
                        } else {
                            questionsData = shuffleArray([...questionsData]);
                            saveShuffleOrder(questionsData, data.questions, SHUFFLE_KEY);
                        }
                    } else {
                        questionsData = shuffleArray([...questionsData]);
                        saveShuffleOrder(questionsData, data.questions, SHUFFLE_KEY);
                    }
                }

                setQuestions(questionsData);
            } catch (error) {
                console.error("Failed to fetch exam", error);
            } finally {
                setLoading(false);
            }
        };

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const saveShuffleOrder = (shuffled, original, key) => {
            // Save indices of original array in their new positions
            const orderIndices = shuffled.map(sQ => original.findIndex(oQ => oQ._id === sQ._id));
            localStorage.setItem(key, JSON.stringify(orderIndices));
        };

        fetchExam();
    }, [id]);

    // Timer Logic with Persistence
    useEffect(() => {
        if (!exam) return;

        const STORAGE_KEY = `exam_start_${id}_${exam._id}`; // Unique key per exam attempt
        let startTime = localStorage.getItem(STORAGE_KEY);

        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem(STORAGE_KEY, startTime);
        } else {
            startTime = parseInt(startTime, 10);
        }

        const calculateTimeLeft = () => {
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const totalSeconds = exam.timeLimitMinutes * 60;
            return Math.max(0, totalSeconds - elapsedSeconds);
        };

        // Initial set
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [exam, id]);

    // Auto-submit Effect
    useEffect(() => {
        if (timeLeft === 0 && !submitting) {
            handleSubmit(true);
        }
    }, [timeLeft, submitting]);

    // ----------------------------------------------------------------------------------
    // SECURITY FEATURES
    // ----------------------------------------------------------------------------------

    // 1. Full Screen Enforcement
    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log(err));
        }
    };

    useEffect(() => {
        if (!exam || !exam.securityEnabled) return;

        // Request on mount
        enterFullScreen();

        const handleFullScreenChange = () => {
            if (submittingRef.current) return; // Skip if submitting
            const isFull = !!document.fullscreenElement;
            setIsFullScreen(isFull);

            if (!isFull) {
                // WARN: Exited Full Screen (e.g. via ESC)
                // Only warn if document is visible (if hidden/alt-tab, visibility handler catches it)
                if (!document.hidden) {
                    setWarningCount(prev => {
                        const newCount = prev + 1;
                        if (newCount >= 3) {
                            alert("Suspicious activity detected (Full Screen Exit)! Your exam is being auto-submitted.");
                            if (handleSubmitRef.current) {
                                handleSubmitRef.current(true);
                            }
                        } else {
                            alert(`Warning ${newCount}/3: Do not exit Full Screen mode!`);
                        }

                        // Persist warnings
                        if (exam) {
                            localStorage.setItem(`exam_warnings_${id}_${exam._id}`, newCount);
                        }
                        return newCount;
                    });
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, [exam, id]);

    // 2. Tab Switch Prevention (Visibility Change) - Only if security enabled
    useEffect(() => {
        if (!exam || !exam.securityEnabled) return;
        const handleVisibilityChange = () => {
            if (submittingRef.current) return; // Skip if submitting
            if (document.hidden) {
                setWarningCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert("Suspicious activity detected! Your exam is being auto-submitted.");
                        if (handleSubmitRef.current) {
                            handleSubmitRef.current(true);
                        }
                    } else {
                        alert(`Warning ${newCount}/3: Do not switch tabs or windows!`);
                    }

                    // Persist warnings
                    if (exam) {
                        localStorage.setItem(`exam_warnings_${id}_${exam._id}`, newCount);
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [exam, id]);

    // 3. Disable Right Click & Special Keys & Navigation - Only if security enabled
    useEffect(() => {
        if (!exam || !exam.securityEnabled) return;
        const handleContextMenu = (e) => e.preventDefault();

        const handleKeyDown = (e) => {
            if (
                e.ctrlKey ||
                e.altKey ||
                e.metaKey ||
                e.key === 'F12' ||
                e.key === 'PrintScreen'
            ) {
                e.preventDefault();
                return false;
            }
        };

        // Block Back Navigation
        const handlePopState = (e) => {
            e.preventDefault();
            window.history.pushState(null, null, window.location.href);
            alert("Navigation is disabled during the exam!");
        };

        // Initialize history state
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', handlePopState);

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [exam]);


    // ----------------------------------------------------------------------------------
    // NAVIGATION & LOGIC
    // ----------------------------------------------------------------------------------

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleClearResponse = (questionId) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[questionId];
            return newAnswers;
        });
    };

    const handleSubmit = async (isAuto = false) => {
        if (!isAuto && !window.confirm("Are you sure you want to finish the exam?")) return;

        submittingRef.current = true; // Mark submission in progress
        setSubmitting(true);
        try {
            const formattedAnswers = Object.keys(answers).map(qId => ({
                questionId: qId,
                selectedIndex: answers[qId]
            }));

            const sessionStr = localStorage.getItem('session');
            const session = sessionStr ? JSON.parse(sessionStr) : null;

            const { data } = await submitExam({
                examId: id,
                answers: formattedAnswers,
                sessionId: session?.sessionId
            });

            // Mark as completed in localStorage with result data
            if (session?.regNo) {
                const COMPLETED_KEY = `completed_exams_${session.regNo}`;
                const completed = JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');

                // Check if exam is already in completed list
                const alreadyCompleted = completed.some(item =>
                    typeof item === 'object' ? item.examId === id : item === id
                );

                const percentage = data.totalQuestions > 0
                    ? Math.round((data.score / data.totalQuestions) * 100)
                    : 0;

                const resultRecord = {
                    examId: id,
                    resultId: data._id,
                    score: data.score,
                    totalQuestions: data.totalQuestions,
                    percentage: percentage
                };

                const existingIndex = completed.findIndex(item =>
                    typeof item === 'object' ? item.examId === id : item === id
                );

                if (existingIndex !== -1) {
                    // Update if it's an object format and either new percentage is higher or it was just an ID before
                    const current = completed[existingIndex];
                    if (typeof current !== 'object' || percentage >= (current.percentage || 0)) {
                        completed[existingIndex] = resultRecord;
                    }
                } else {
                    completed.push(resultRecord);
                }
                localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
            }

            // Clear timer and warning storage
            if (exam) {
                localStorage.removeItem(`exam_start_${id}_${exam._id}`);
                localStorage.removeItem(`exam_warnings_${id}_${exam._id}`);
            }

            // Exit fullscreen before navigating
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(e => console.log(e));
            }

            if (exam.showResult) {
                navigate(`/result/${data._id}`, { replace: true });
            } else {
                alert("Exam Submitted Successfully! You can now return to the dashboard.");
                navigate('/exams', { replace: true });
            }
        } catch (error) {
            console.error("Submission failed", error);
            if (!isAuto) alert("Failed to submit exam. Please try again.");
            setSubmitting(false);
        }
    };

    // Keep handleSubmitRef in sync
    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    }, [handleSubmit]);

    // Helper to determine status color
    const getStatusColor = (index, qId) => {
        if (currentQuestionIndex === index) return 'bg-yellow-500 text-black border-yellow-600'; // Current
        if (answers[qId] !== undefined) return 'bg-green-600 text-white border-green-700'; // Answered
        return 'bg-red-600 text-white border-red-700'; // Not Answered / Visited (Technically all are 'not answered' initially)
    };

    // NOTE: In a real app we'd track "visited" vs "not visited". 
    // For now: Green = Answered, Red = Not Answered, Yellow = Current.

    if (loading) return <div className="min-h-screen bg-gray-900 flex justify-center items-center"><Loader /></div>;
    if (!exam) return <div className="min-h-screen bg-gray-900 text-white p-8">Exam not found</div>;

    // Overlay for Security (Only show if security is enabled)
    if (exam.securityEnabled && !isFullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-6xl text-red-500">warning</span>
                </div>
                <h2 className="text-3xl font-bold text-red-500 mb-4">Security Violation</h2>
                <p className="text-gray-300 max-w-lg mb-8 text-lg">
                    Multi-tasking is not allowed. You must remain in Full Screen mode to continue the exam.
                </p>
                <button
                    onClick={enterFullScreen}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg transition-transform hover:scale-105"
                >
                    Return to Exam
                </button>
            </div>
        );
    }

    // Main Exam UI
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return null;

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden select-none">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 h-20 flex items-center justify-between px-8 py-5 shrink-0 shadow-lg">
                <div className="flex items-center space-x-6">
                    <span className="text-2xl font-bold text-red-600 tracking-tighter">{APP_NAME} <span className="text-white">Setu</span></span>
                    <div className="h-8 w-px bg-gray-600/50"></div>
                    <div className="text-gray-300 text-sm font-medium hidden md:block">{exam.title}</div>
                    <div className="hidden lg:flex items-center text-gray-400 text-xs font-medium bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-600/50">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_month</span>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>

                <div className="flex items-center space-x-8">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        {(() => {
                            const sessionStr = localStorage.getItem('session');
                            const session = sessionStr ? JSON.parse(sessionStr) : {};
                            return (
                                <>
                                    <span className="text-sm font-bold text-gray-200">{session.name || 'Student'}</span>
                                    <span className="text-xs text-gray-400">Reg: {session.regNo || 'N/A'}</span>
                                </>
                            );
                        })()}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1">timer</span> Time Remaining
                        </span>
                        <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-gray-100'}`}>
                            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                        <span className="material-symbols-outlined text-gray-300">person</span>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Question Area */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold text-gray-100">Question {currentQuestionIndex + 1}</h2>
                        <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-400 border border-gray-700">
                            Single Choice
                        </span>
                    </div>

                    {/* Question Text */}
                    <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 mb-8 min-h-[200px]">
                        <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap font-mono">{currentQ.text}</p>
                    </div>

                    {/* Options */}
                    <div className="space-y-4 max-w-3xl">
                        {currentQ.options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleOptionSelect(currentQ._id, index)}
                                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all group ${answers[currentQ._id] === index
                                    ? 'bg-red-900/20 border-red-500'
                                    : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${answers[currentQ._id] === index
                                    ? 'border-red-500'
                                    : 'border-gray-500 group-hover:border-gray-400'
                                    }`}>
                                    {answers[currentQ._id] === index && <div className="w-3 h-3 rounded-full bg-red-500" />}
                                </div>
                                <span className={`text-lg ${answers[currentQ._id] === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                    }`}>
                                    {option}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-8 flex justify-between items-center border-t border-gray-800">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleClearResponse(currentQ._id)}
                                className="px-6 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-900/20 transition-colors font-medium"
                            >
                                Reset Answer
                            </button>
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                Previous
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                if (currentQuestionIndex < questions.length - 1) {
                                    setCurrentQuestionIndex(prev => prev + 1);
                                } else {
                                    // Make sure we save before jumping? No need, state is synced.
                                }
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-transform hover:scale-105"
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Save' : 'Save & Next'}
                        </button>
                    </div>
                </div>

                {/* Right: Palette Sidebar */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-700 bg-gray-800">
                        <h3 className="font-bold text-gray-200 mb-4">Question Palette</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div className="flex items-center"><div className="w-3 h-3 bg-green-600 rounded mr-2"></div> Attempted</div>
                            <div className="flex items-center"><div className="w-3 h-3 bg-red-600 rounded mr-2"></div> Not Attempted</div>
                            <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div> Current</div>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-3">
                            {questions.map((q, idx) => (
                                <button
                                    key={q._id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm transition-transform hover:scale-110 border ${getStatusColor(idx, q._id)}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-700 bg-gray-800">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg mb-2 transition-colors"
                        >
                            {submitting ? 'Submitting...' : 'Finish Exam'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamAttempt;
