import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamWaiting = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(30);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const checkFullScreen = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', checkFullScreen);
        checkFullScreen();
        return () => document.removeEventListener('fullscreenchange', checkFullScreen);
    }, []);

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log("Full screen denied:", err);
            });
        }
    };

    const handleStartExam = () => {
        enterFullScreen();
        navigate(`/exams/${id}`);
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            if (isFullScreen) {
                navigate(`/exams/${id}`);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, id, navigate, isFullScreen]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <main className="p-10 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="bg-gray-800 p-12 rounded-2xl shadow-xl text-center max-w-lg w-full border border-gray-700">
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <span className="material-symbols-outlined text-5xl text-red-500">hourglass_empty</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-100">Get Ready!</h2>
                        <p className="text-gray-400 mt-2">Your exam will start in a moment.</p>
                    </div>

                    {timeLeft > 0 ? (
                        <>
                            <div className="text-6xl font-black text-red-500 mb-8 font-mono tracking-wider flex justify-center items-center">
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </div>
                            <p className="text-xs text-gray-500">
                                The exam will start automatically in Full Screen mode.
                            </p>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-lg text-yellow-400 font-medium">Time's Up!</p>
                            <button
                                onClick={handleStartExam}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
                            >
                                Start Exam Now
                                <span className="material-symbols-outlined ml-2">play_arrow</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExamWaiting;
