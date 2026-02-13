import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminExamById, updateExam } from '../../services/examApi';
import Loader from '../../components/Loader';

const EditExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState(15);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [category, setCategory] = useState('All Exam');
    const [showResult, setShowResult] = useState(true);
    const [isHidden, setIsHidden] = useState(false);
    const [securityKey, setSecurityKey] = useState('');
    const [removeKey, setRemoveKey] = useState(false);
    const [randomizeQuestions, setRandomizeQuestions] = useState(false);
    const [securityEnabled, setSecurityEnabled] = useState(false);
    const [questions, setQuestions] = useState([
        { text: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const { data } = await getAdminExamById(id);
                const { exam, questions: fetchedQuestions } = data;

                setTitle(exam.title);
                setDescription(exam.description);
                setTimeLimit(exam.timeLimitMinutes);
                setCategory(exam.category || 'All Exam');
                setSecurityKey(exam.securityKey || ''); // Note: Controller might not return it if we used the same 'getExamById' for students, BUT for admin edit we need it. 
                // Wait, I updated controller to hide it! "exclude securityKey from response".
                // I need another endpoint for admin or update 'getExamById' to reveal it if admin?
                // Or just allow setting a NEW key. 
                // Let's check controller again. Step 192: delete examObj.securityKey.
                // So I won't get it. I can't show the existing key. 
                // I will show a placeholder or empty. If empty on submit, do I clear it or keep it?
                // Controller updateExam: if (securityKey !== undefined) exam.securityKey = securityKey;
                // If I send empty string, it will clear it.
                // If I don't send it, it keeps it.
                // Problem: If I load empty, user might think there is no key.
                // Solution: check `hasSecurityKey` from response (added in Step 192).
                // If hasSecurityKey is true, I can show "********" or just handle "Enter new key to change".
                setStartTime(exam.startTime ? new Date(exam.startTime).toISOString().slice(0, 16) : '');
                setEndTime(exam.endTime ? new Date(exam.endTime).toISOString().slice(0, 16) : '');
                setShowResult(exam.showResult !== undefined ? exam.showResult : true);
                setIsHidden(exam.isHidden !== undefined ? exam.isHidden : false);
                setRandomizeQuestions(exam.randomizeQuestions !== undefined ? exam.randomizeQuestions : false);
                setSecurityEnabled(exam.securityEnabled !== undefined ? exam.securityEnabled : false);

                // Format questions for state
                const formattedQuestions = fetchedQuestions.map(q => ({
                    text: q.text,
                    options: q.options,
                    correctIndex: q.correctIndex || 0, // backend might hide this? No, we need it.
                    // Wait, previous getExamById obscured correctIndex? 
                    // I need to check controller. 
                    // Step 20 controller says: .select('-correctIndex')
                    // This is a problem for EDITING. Admin needs to see correct answer.
                }));

                // Ideally I should update controller to allow admin to see correct index, or fetching specific admin endpoint.
                // For now, I will assume I need to fix controller first? 
                // Let's assume I will fix controller to return correctIndex if needed, or I'll just load what I have.
                // If I don't have correctIndex, I default to 0, which is bad.

                setQuestions(formattedQuestions);
            } catch (error) {
                console.error("Failed to load exam", error);
                alert("Failed to load exam details");
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);


    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correctIndex: 0 }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const examData = {
                title,
                description,
                timeLimitMinutes: timeLimit,
                questions,
                startTime,
                endTime,
                category,
                showResult,
                isHidden,
                randomizeQuestions,
                securityEnabled
            };

            // Handle Security Key update logic
            // 1. If removeKey is true, send empty string to clear it
            // 2. If securityKey has value, send it to update
            // 3. If neither (empty and not removing), don't send it (undefined) so backend keeps existing
            if (removeKey) {
                examData.securityKey = "";
            } else if (securityKey.trim()) {
                examData.securityKey = securityKey;
            }

            await updateExam(id, examData);
            alert('Exam Updated Successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Failed to update exam');
            console.error(error);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-900 p-8 pb-20 text-gray-100">
            <nav className="bg-gray-800 shadow-lg px-8 py-5 flex justify-between items-center fixed top-0 left-0 right-0 z-10 h-20 text-white mb-8 border-b border-gray-700">
                <div className="flex items-center space-x-6">
                    <h1 className="text-2xl font-bold text-red-500 font-mono tracking-tight">Edit Exam</h1>
                    <div className="hidden md:flex items-center text-gray-400 text-sm font-medium bg-gray-700/50 px-4 py-2 rounded-full border border-gray-600/50">
                        <span className="mr-2">📅</span>
                        {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>
                <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-white transition-colors font-medium border border-gray-600/50 px-4 py-2 rounded-lg hover:bg-gray-700/50">Back to Dashboard</button>
            </nav>

            <div className="max-w-4xl mx-auto mt-24 bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Exam Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Time Limit (Minutes)</label>
                            <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Time (Optional)</label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">End Time (Optional)</label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none [color-scheme:dark]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
                            >
                                <option value="All Exam">All Exam</option>
                                <option value="Class Test">Class Test</option>
                                <option value="CCC">CCC</option>
                                <option value="ADCA">ADCA</option>
                                <option value="O Level">O Level</option>
                                <option value="Tally">Tally</option>
                            </select>
                            <p className="text-xs text-gray-400 mt-1">Select where this exam should be displayed.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <input
                                type="checkbox"
                                id="showResult"
                                checked={showResult}
                                onChange={(e) => setShowResult(e.target.checked)}
                                className="w-5 h-5 text-red-600 rounded bg-gray-700 border-gray-500 focus:ring-red-500 focus:ring-offset-gray-900 shadow-sm"
                            />
                            <label htmlFor="showResult" className="text-gray-300 font-medium cursor-pointer select-none">
                                Show Result to Student
                            </label>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <input
                                type="checkbox"
                                id="randomizeQuestions"
                                checked={randomizeQuestions}
                                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                                className="w-5 h-5 text-red-600 rounded bg-gray-700 border-gray-500 focus:ring-red-500 focus:ring-offset-gray-900 shadow-sm"
                            />
                            <label htmlFor="randomizeQuestions" className="text-gray-300 font-medium cursor-pointer select-none">
                                Randomize Question Order
                            </label>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <input
                                type="checkbox"
                                id="isHidden"
                                checked={isHidden}
                                onChange={(e) => setIsHidden(e.target.checked)}
                                className="w-5 h-5 text-red-600 rounded bg-gray-700 border-gray-500 focus:ring-red-500 focus:ring-offset-gray-900 shadow-sm"
                            />
                            <label htmlFor="isHidden" className="text-gray-300 font-medium cursor-pointer select-none">
                                Hide Exam from Students
                            </label>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <input
                                type="checkbox"
                                id="securityEnabled"
                                checked={securityEnabled}
                                onChange={(e) => setSecurityEnabled(e.target.checked)}
                                className="w-5 h-5 text-red-600 rounded bg-gray-700 border-gray-500 focus:ring-red-500 focus:ring-offset-gray-900 shadow-sm"
                            />
                            <label htmlFor="securityEnabled" className="text-gray-300 font-medium cursor-pointer select-none">
                                Enable Strict Security Mode
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-400" rows="2"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Security Key {securityEnabled && <span className="text-red-500">*</span>}</label>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={securityKey}
                                onChange={e => setSecurityKey(e.target.value)}
                                disabled={removeKey || !securityEnabled}
                                required={securityEnabled && !removeKey}
                                placeholder={
                                    !securityEnabled
                                        ? "Security disabled - key not needed"
                                        : removeKey
                                            ? "Key will be removed"
                                            : "Enter new key to update (leave empty to keep existing)"
                                }
                                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-400 ${(removeKey || !securityEnabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                            {securityEnabled && (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="removeKey"
                                        checked={removeKey}
                                        onChange={(e) => setRemoveKey(e.target.checked)}
                                        className="w-4 h-4 text-red-600 rounded bg-gray-700 border-gray-500 focus:ring-red-500"
                                    />
                                    <label htmlFor="removeKey" className="text-sm text-gray-400 cursor-pointer select-none">
                                        Remove / Clear Security Key
                                    </label>
                                </div>
                            )}
                            <p className="text-xs text-gray-400">
                                {securityEnabled
                                    ? "Required when security mode is enabled. Students will need this key to start the exam."
                                    : "Enable security mode above to set a security key."
                                }
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-bold text-gray-100 mb-4">Questions</h3>
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-gray-700/50 p-6 rounded-lg mb-6 border border-gray-600">
                                <div className="flex justify-between mb-4">
                                    <h4 className="font-medium text-gray-200">Question {qIndex + 1}</h4>
                                    {questions.length > 1 && (
                                        <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                    )}
                                </div>
                                <textarea
                                    placeholder="Enter question text (supports code snippets)"
                                    value={q.text}
                                    onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg mb-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, oIndex) => (
                                        <input
                                            key={oIndex}
                                            type="text"
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={opt}
                                            onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            required
                                            className={`w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none ${q.correctIndex === oIndex ? 'border-green-500 ring-1 ring-green-500' : ''}`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <label className="text-sm text-gray-300 mr-2">Correct Option:</label>
                                    <select
                                        value={q.correctIndex}
                                        onChange={e => handleQuestionChange(qIndex, 'correctIndex', parseInt(e.target.value))}
                                        className="bg-gray-600 border border-gray-500 text-white rounded px-2 py-1 outline-none"
                                    >
                                        {q.options.map((_, i) => <option key={i} value={i}>Option {i + 1}</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors">
                            + Add Question
                        </button>
                    </div>

                    <div className="flex justify-between gap-4">
                        <button type="button" onClick={() => navigate('/admin/dashboard')} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-colors">
                            Update Exam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExam;
