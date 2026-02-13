import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { sendFeedback } from '../services/examApi';

const Feedback = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(10);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Countdown simulation
        for (let i = 5; i > 0; i--) {
            setCount(i);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setCount(0);

        try {
            await sendFeedback(formData);
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => {
                setSuccess(false);
                setCount(10);
            }, 3000); // Show success message for 3 seconds
        } catch (err) {
            setError('Failed to send feedback. Please try again.');
            setCount(10);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Sidebar />
            <nav className="bg-gray-800 shadow-lg px-8 py-5 flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-20 text-white mb-8 border-b border-gray-700 ml-64">
                <div className="flex items-center space-x-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Send Feedback</h1>
                </div>
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors font-medium border border-gray-600/50 px-4 py-2 rounded-lg hover:bg-gray-700/50">
                    Back
                </button>
            </nav>

            <div className="flex-1 ml-64 mt-20 p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
                        {success ? (
                            <div className="text-green-500 text-center py-10">
                                <span className="material-symbols-outlined text-6xl mb-4">check_circle</span>
                                <p className="text-xl">Feedback sent successfully!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded">{error}</div>}

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:opacity-50 transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:opacity-50 transition-colors"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        disabled={loading}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:opacity-50 transition-colors"
                                        placeholder="Type your feedback or query here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg hover:shadow-red-900/20"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            Sending in {count}s...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined mr-2">send</span>
                                            Send Feedback
                                        </>
                                    )}
                                </button>
                                <p className="text-gray-400 text-xs text-center mt-3">
                                    इसमें कुछ समय लग सकता है, कृपया धैर्य बनाए रखें। आपके सहयोग और समझ के लिए धन्यवाद।
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
