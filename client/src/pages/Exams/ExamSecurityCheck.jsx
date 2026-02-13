import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyExamKey } from '../../services/examApi';

const ExamSecurityCheck = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [key, setKey] = useState('');
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await verifyExamKey(id, key);
            if (data.success) {
                // Navigate to instructions with verified flag
                navigate(`/exams/${id}/instructions`, { state: { verified: true } });
            } else {
                setError('Invalid Security Key');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <span className="material-symbols-outlined text-5xl text-red-600 mb-4 bg-red-900/20 p-4 rounded-full border border-red-500/30">
                        lock
                    </span>
                    <h2 className="text-2xl font-bold mt-2">Protected Exam</h2>
                    <p className="text-gray-400 mt-2">This exam is password protected. Please enter the security key to proceed.</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter Security Key"
                            className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none text-center text-lg placeholder-gray-500 tracking-widest"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-2 text-center bg-red-900/20 py-1 rounded border border-red-900/50">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                        Verify Key
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/exams')}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 rounded-lg transition-colors border border-gray-600"
                    >
                        Go Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExamSecurityCheck;
