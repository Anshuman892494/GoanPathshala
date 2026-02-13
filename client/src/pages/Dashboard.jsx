import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { getExams } from '../services/examApi';
import { useState, useEffect } from 'react';

const LatestExamsSection = () => {
    const [latestExams, setLatestExams] = useState([]);
    const [completedExams, setCompletedExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data } = await getExams();
                // Sort by _id descending (newest first)
                const sorted = [...data].sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return b._id.localeCompare(a._id);
                });

                // Filter out expigreen exams
                const now = new Date();
                const activeExams = sorted.filter(exam => {
                    if (!exam.endTime) return true;
                    return new Date(exam.endTime) > now;
                });

                setLatestExams(activeExams.slice(0, 3));

                // Fetch completed exams
                const sessionStr = localStorage.getItem('session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);

                    // Get from database
                    if (session.sessionId) {
                        try {
                            const { getUserResults } = await import('../services/examApi');
                            const { data: results } = await getUserResults(session.sessionId);
                            const dbCompleted = results.map(result => ({
                                examId: result.examId?._id ? result.examId._id.toString() : result.examId.toString(),
                                resultId: result._id,
                                score: result.score,
                                totalQuestions: result.totalQuestions,
                                percentage: result.totalQuestions > 0
                                    ? Math.round((result.score / result.totalQuestions) * 100)
                                    : 0
                            }));
                            setCompletedExams(dbCompleted);
                        } catch (err) {
                            console.error('Failed to fetch user results:', err);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch latest exams", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) return <Loader />;
    if (latestExams.length === 0) return null;

    return (
        <div className="mb-10">
            <div className="flex items-center mb-6">
                <span className="material-symbols-outlined text-green-500 mr-2 text-3xl">new_releases</span>
                <h3 className="text-2xl font-bold text-gray-100">Latest Exams</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestExams.map((exam) => {
                    const completedData = completedExams.find(item => item.examId === exam._id.toString());

                    return (
                        <div key={exam._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all shadow-lg group flex flex-col justify-between">
                            <div className="relative">
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-pulse">NEW</span>
                                <h4 className="font-bold text-lg text-gray-100 mb-2 group-hover:text-green-400 transition-colors line-clamp-1">{exam.title}</h4>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{exam.description}</p>
                            </div>

                            {completedData ? (
                                <div className="flex gap-2 mt-auto">
                                    <button
                                        disabled
                                        className="flex-1 text-center bg-green-800 text-green-200 font-bold py-2 px-4 rounded cursor-not-allowed border border-green-700 flex items-center justify-center text-sm"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                        Score: {completedData.percentage}%
                                    </button>
                                    <Link
                                        to={`/result/${completedData.resultId}`}
                                        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center text-sm"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                                        View
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to={
                                        exam.securityEnabled
                                            ? (exam.hasSecurityKey ? `/exams/${exam._id}/security-check` : `/exams/${exam._id}/instructions`)
                                            : `/exams/${exam._id}`
                                    }
                                    className="mt-auto w-full text-center bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white border border-green-600/50 font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center"
                                >
                                    Start Now
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Dashboard = () => {
    // Get Session User
    const sessionStr = localStorage.getItem('session');
    const user = sessionStr ? JSON.parse(sessionStr) : null;

    const GuideCard = ({ number, title, engText, hindiText, color }) => (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all hover:bg-gray-800/80 group">
            <div className={`flex items-center mb-4 ${color}`}>
                <h4 className="font-bold text-lg">{number}. {title}</h4>
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
                <p className="text-gray-300">{engText}</p>
                <div className="h-px bg-gray-700/50 w-full my-2"></div>
                <p className="text-gray-400 font-hindi">{hindiText}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />

                <main className="flex-1 p-8 bg-gray-900 relative overflow-hidden mt-20">
                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-900/10 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-900/05 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto">


                        {/* Welcome Header */}
                        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-8">
                            <div>
                                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2">
                                    Welcome, <span className="text-green-500">{user ? user.name : 'Student'}</span>
                                </h2>
                                <p className="text-gray-400 max-w-2xl">
                                    Prepare for your success with ACCI ExamPoint. Please read the instructions below carefully before starting your assessment.
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right hidden md:block">
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Registration No.</p>
                                <p className="text-xl font-mono text-gray-200 bg-gray-800 px-3 py-1 rounded border border-gray-700 inline-block mt-1">
                                    {user ? user.regNo : '---'}
                                </p>
                            </div>
                        </div>

                        {/* New Exam Added */}
                        {/* add here latest three cards of exam in one row(when top 3 new exam added that shown here)*/}
                        <LatestExamsSection />

                        {/* Instructions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <GuideCard
                                number="1"
                                title="General Guidelines"
                                color="text-green-400"
                                engText="Welcome to the ACCI ExamPoint platform. This secure environment is designed to assess your knowledge effectively. Ensure stable internet."
                                hindiText="ACCI ExamPoint प्लेटफॉर्म पर आपका स्वागत है। यह सुरक्षित वातावरण आपके ज्ञान का आकलन करने के लिए है। स्थिर इंटरनेट सुनिश्चित करें।"
                            />
                            <GuideCard
                                number="2"
                                title="Exam Structure"
                                color="text-green-400"
                                engText="All exams are timed with a visible countdown. Questions are multiple-choice. Complete the exam in one sitting."
                                hindiText="सभी परीक्षाएं समयबद्ध हैं। प्रश्न बहुविकल्पीय हैं। परीक्षा को एक ही बार में पूरा करें।"
                            />
                            <GuideCard
                                number="3"
                                title="Exam Retake"
                                color="text-yellow-400"
                                engText="You can retake the exam if you are not satisfied with the result."
                                hindiText="यदि आप अपने परिणाम से संतुष्ट नहीं हैं, तो आप परीक्षा दोबारा दे सकते हैं।"
                            />
                            <GuideCard
                                number="4"
                                title="Exam Result"
                                color="text-purple-400"
                                engText="You can view the exam result with all correct questions and answers."
                                hindiText="आप परीक्षा का परिणाम सभी सही प्रश्नों और उनके उत्तरों के साथ देख सकते हैं।"
                            />
                            <GuideCard
                                number="5"
                                title="Leaderboard"
                                color="text-blue-400"
                                engText="You can view the leaderboard to see where you stand among other students."
                                hindiText="आप अन्य छात्रों के बीच अपनी स्थिति देखने के लिए लीडरबोर्ड देख सकते हैं।"
                            />
                            <GuideCard
                                number="6"
                                title="Notes"
                                color="text-lime-400"
                                engText="You can download the notes for the each subjects in notes section."
                                hindiText="आप नोट्स सेक्शन में प्रत्येक विषय के लिए नोट्स डाउनलोड कर सकते हैं।"
                            />
                            <GuideCard
                                number="7"
                                title="Feedback"
                                color="text-pink-400"
                                engText="If you find any issue in the exam, please provide feedback to the admin."
                                hindiText="यदि आपको परीक्षा में कोई समस्या आती है, तो कृपया एडमिन को फीडबैक दें।"
                            />
                        </div>

                        {/* Call to Action & Warning */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-2xl p-8 border border-gray-700 flex flex-col md:flex-row items-center justify-between shadow-xl">
                            <div className="mb-6 md:mb-0 md:mr-8">
                                <h3 className="text-xl font-bold text-gray-100 flex items-center mb-2">
                                    <span className="material-symbols-outlined text-yellow-500 mr-2">warning</span>
                                    Important Reminder
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Do not forget to <b>Logout</b> after completing your exam to secure your account.
                                    <br />
                                    <span className="text-gray-500 font-hindi mt-1 block">परीक्षा समाप्त होने के बाद अपना अकाउंट लॉगआउट करना न भूलें।</span>
                                </p>
                            </div>
                            <Link
                                to="/exams"
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-green-600 font-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-1"
                            >
                                <span className="mr-2 text-lg">View Available Exams</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );



};

export default Dashboard;
