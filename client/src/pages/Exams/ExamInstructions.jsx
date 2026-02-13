import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamInstructions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log("Full screen denied:", err);
            });
        }
    };

    const handleStart = () => {
        if (accepted) {
            enterFullScreen();
            navigate(`/exams/${id}/waiting`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* <main className="ml-64 mt-20 p-10 bg-gray-900 min-h-[calc(100vh-5rem)]"> */}
            <main className="p-10 bg-gray-900 min-h-[calc(100vh-5rem)]">
                <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="bg-red-700 px-8 py-6 flex items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
                            <p className="text-red-100 mt-1">Please review the rules before proceeding.</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="prose text-gray-300">
                            <p className="font-medium text-lg">By proceeding to the exam, you agree to the following:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>
                                    <span className="font-semibold text-gray-100">No Cheating:</span> Using unauthorized materials, devices, or assistance from others is strictly prohibited.
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-100">Browser Monitoring:</span> Do not leave the exam window. Switching tabs or windows may be logged as suspicious activity.
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-100">Time Limit:</span> The exam is timed. It will automatically submit when the time expires.
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-100">Submission:</span> Once submitted, you cannot re-attempt the exam unless allowed by the administrator.
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-100">Technical Issues:</span> Ensure you have a stable internet connection. We are not responsible for disconnections during the exam.
                                </li>
                            </ul>
                        </div>

                        <div className="border-t border-gray-700 pt-6 mt-8">
                            <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="mt-1 h-5 w-5 text-red-600 focus:ring-red-500 border-gray-500 rounded bg-gray-700"
                                />
                                <span className="text-gray-300 select-none">
                                    I have read and understood the instructions. I agree to abide by the rules and regulations of this examination.
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleStart}
                                disabled={!accepted}
                                className={`px-8 py-4 rounded-lg font-bold text-lg shadow-md transition-all transform hover:scale-105 flex items-center ${accepted
                                    ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Proceed to Exam
                                <span className="material-symbols-outlined ml-2">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExamInstructions;
