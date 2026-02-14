import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { getLeaderboard, getStudentById, updateStudent } from '../services/examApi';
import { APP_NAME } from '../utils/constants';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        bio: user?.bio || '',
        avatar: user?.avatar || '',
        institute: user?.institute || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                ...formData,
                name: user.name,
                firstName: user.firstName || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                avatar: user.avatar || '',
                institute: user.institute || ''
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-[#0f1115] border border-gray-800/50 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="relative p-8 pb-6 border-b border-gray-800/50 bg-gradient-to-r from-green-900/10 to-transparent">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[40px] rounded-full"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-2xl font-extrabold text-white tracking-tighter">Profile Settings</h3>
                            <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">Personalize your student identity</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold p-4 rounded-2xl text-center uppercase tracking-widest animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Section 1: Basic Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">General Information</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">First Name</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-green-500 transition-colors">person</span>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Last Name</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-green-500 transition-colors">person</span>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Profile Branding (Bio)</label>
                            <textarea
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all h-24 resize-none focus:bg-gray-900"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Section 2: Contact & Institute */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Connect & Education</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-green-500 transition-colors">mail</span>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Phone Number</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-green-500 transition-colors">call</span>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Institute / Learning Center</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-green-500 transition-colors">school</span>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                    value={formData.institute}
                                    onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Profile Image Highlight (URL)</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-green-500 transition-colors">image</span>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-green-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Security */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Security Credentials</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">New Password</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-orange-500 transition-colors">lock</span>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-orange-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Confirm Changes</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm group-focus-within:text-orange-500 transition-colors">lock_reset</span>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-orange-500/50 focus:outline-none transition-all focus:bg-gray-900"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="p-8 pt-6 border-t border-gray-800/50 bg-gray-900/30 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-2xl border border-gray-800 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-900/20 text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{loading ? 'Processing Update...' : 'Synchronize Profile'}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileCard = ({ user, onEditClick }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-[1.5rem] p-6 border border-gray-700/50 shadow-2xl flex flex-col gap-6 sticky top-28 group hover:border-green-500/30 transition-all duration-500">
        <div className="flex flex-col items-center text-center gap-3">
            <div className="relative group cursor-pointer inline-block" onClick={onEditClick}>
                <div className="absolute -inset-1 bg-gradient-to-tr from-green-500 to-green-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80"}
                    alt="Profile"
                    className="relative w-24 h-24 rounded-2xl object-cover border-2 border-gray-800 shadow-xl"
                />
            </div>

            <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                    {user?.name || "Student Name"}
                    <span className="material-symbols-outlined text-green-500 text-base font-black">verified</span>
                </h2>
                <p className="text-green-500 font-bold text-[10px] tracking-widest lowercase opacity-80">{user?.email || user?.studentId}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center group-hover:border-green-500/20 transition-colors">
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">Current Rank</p>
                <p className="text-lg font-black text-white">{user?.rank ? `#${user?.rank}` : "NR"}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center group-hover:border-green-500/20 transition-colors">
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">Phone</p>
                <p className="text-sm font-bold text-white line-clamp-1">{user?.phone || 'N/A'}</p>
            </div>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed text-center font-light italic opacity-80">
            "{user?.bio || "Learning to code at GoanSetu. Exploring future possibilities."}"
        </p>

        <button
            onClick={onEditClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-900/10 flex items-center justify-center text-xs uppercase tracking-widest group"
        >
            Edit Profile
            <span className="material-symbols-outlined ml-2 text-sm group-hover:translate-x-1 transition-transform">edit_note</span>
        </button>

        <div className="space-y-3 pt-4 border-t border-gray-800">
            {[
                { icon: "location_on", text: "India" },
                { icon: "school", text: user?.institute }
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-base text-green-500/80 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-xs font-medium tracking-wide">{item.text}</span>
                </div>
            ))}
        </div>
    </div>
);

const MonthView = ({ attendance = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    // Adjust for Monday start if needed, but standard Sunday-Start is usually fine.
    // 0 = Sunday, 1 = Monday. Let's stick to Sunday start for consistency with standard calendars.

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isToday = (d) => {
        const today = new Date();
        return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const getDayStatus = (d) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        return attendance.includes(dateStr) ? 'present' : 'absent';
    };

    const days = [];
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
        const status = getDayStatus(d);
        const dayIsToday = isToday(d);
        days.push(
            <div key={d} className={`h-10 flex items-center justify-center rounded-lg text-sm font-bold relative group
                ${status === 'present' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800/40 text-gray-500'}
                ${dayIsToday ? 'ring-2 ring-white/50' : ''}
            `}>
                <span className="relative z-10">{d}</span>
                {status === 'present' && <div className="absolute inset-0 bg-green-500/10 blur-sm rounded-lg"></div>}
            </div>
        );
    }

    return (
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-[2rem] p-8 border border-gray-800 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500">calendar_month</span>
                    {monthNames[month]} <span className="text-gray-500">{year}</span>
                </h3>
                <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days}
            </div>
            <div className="mt-6 flex justify-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500/50 border border-green-500/50"></div>
                    <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-800/50"></div>
                    <span>Absent</span>
                </div>
            </div>
        </div>
    );
};

const AttendanceSection = ({ attendance = [] }) => {
    const [viewMode, setViewMode] = useState('month'); // 'heatmap' or 'month'

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
                    <h3 className="text-lg font-bold text-white tracking-tight text-xs uppercase opacity-80">Attendance</h3>
                </div>
                <div className="bg-gray-800/50 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode('heatmap')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'heatmap' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Heatmap
                    </button>
                </div>
            </div>

            {viewMode === 'heatmap' ? (
                <HeatmapSection attendance={attendance} />
            ) : (
                <MonthView attendance={attendance} />
            )}
        </div>
    );
}


/* HeatmapSection component remains unchanged, just not exported or moved */
const HeatmapSection = ({ attendance = [] }) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check leap year for Feb
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) {
        monthDays[1] = 29;
    }

    // Generate 7 months window (3 before, current, 3 after)
    const monthsData = [];
    for (let i = -3; i <= 3; i++) {
        let targetMonthIdx = (currentMonthIdx + i + 12) % 12;
        let targetYear = currentYear;

        // Adjust year if we wrap around
        if (currentMonthIdx + i < 0) targetYear--;
        else if (currentMonthIdx + i > 11) targetYear++;

        const name = monthNames[targetMonthIdx];
        const days = monthDays[targetMonthIdx];
        const weeks = [];
        let currentWeek = [];
        const monthNum = (targetMonthIdx + 1).toString().padStart(2, '0');

        for (let d = 1; d <= days; d++) {
            const dayStr = d.toString().padStart(2, '0');
            const dateKey = `${targetYear}-${monthNum}-${dayStr}`;
            const isPresent = attendance.includes(dateKey);

            currentWeek.push({ day: d, date: dateKey, isPresent });

            if (currentWeek.length === 7 || d === days) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        monthsData.push({ name, days, weeks, year: targetYear, monthIdx: targetMonthIdx });
    }

    // Monthly Calculation
    const currentMonthData = monthsData.find(m => m.monthIdx === currentMonthIdx && m.year === currentYear);
    const daysInMonth = currentMonthData ? currentMonthData.days : 30;
    const presentInMonth = attendance.filter(date => {
        const [y, m] = date.split('-').map(Number);
        return y === currentYear && m === (currentMonthIdx + 1);
    }).length;

    const monthlyPercentage = Math.round((presentInMonth / daysInMonth) * 100);
    const yearlyPercentage = Math.round((attendance.length / 365) * 100);

    return (
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-[2rem] p-8 border border-gray-800 group hover:border-green-500/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                        {attendance.length} <span className="text-gray-500 font-light italic text-xs ml-1">Days Present</span>
                    </h3>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">This Month</p>
                        <p className="text-lg font-black text-white">{monthlyPercentage}% <span className="text-xs font-normal text-gray-500">Attendance</span></p>
                    </div>
                    <div className="text-right border-l border-gray-800 pl-6">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Yearly Avg</p>
                        <p className="text-sm font-bold text-gray-400">{yearlyPercentage}%</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 -mx-1 scrollbar-hide">
                <div className="flex justify-center items-start gap-6 min-w-max px-2">
                    {monthsData.map((month, midx) => (
                        <div key={midx} className="flex-none flex flex-col gap-3">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter text-center">{month.name}</span>

                            <div className="flex gap-1 justify-center">
                                {month.weeks.map((week, widx) => (
                                    <div key={widx} className="flex flex-col gap-1">
                                        {week.map((dayData, didx) => (
                                            <div
                                                key={didx}
                                                className={`w-[12px] h-[12px] rounded-[3px] transition-all duration-500 hover:scale-150 hover:z-10 cursor-pointer
                                                    ${dayData.isPresent ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-gray-800/40 hover:bg-gray-700/60'}`}
                                                title={dayData.date}
                                            >
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/50 flex justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest opacity-60">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500"></div>
                        <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-800"></div>
                        <span>Absent / Pending</span>
                    </div>
                </div>
                <span>Year: {currentYear}</span>
            </div>
        </div>
    );
};


const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        const sessionStr = localStorage.getItem('session');
        if (sessionStr) {
            let sessionData = JSON.parse(sessionStr);

            try {
                // Fetch full student details to get Phone and other fields
                const { data: fullStudent } = await getStudentById(sessionData.studentId);

                // Fetch real-time rank from leaderboard
                const { data: lbData } = await getLeaderboard();
                let rank = null;
                if (lbData && lbData.leaderboard) {
                    const studentInLeaderboard = lbData.leaderboard.find(s => s.regNo === sessionData.regNo);
                    if (studentInLeaderboard) rank = studentInLeaderboard.rank;
                }

                const mergedUser = {
                    ...sessionData,
                    ...fullStudent,
                    name: `${fullStudent.firstName} ${fullStudent.lastName}`,
                    rank: rank
                };

                setUserData(mergedUser);
                localStorage.setItem('session', JSON.stringify(mergedUser));
            } catch (error) {
                console.error('Failed to fetch full student details:', error);
                setUserData(sessionData);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const handleSaveProfile = async (updatedDetails) => {
        const updateData = {
            firstName: updatedDetails.firstName,
            lastName: updatedDetails.lastName,
            email: updatedDetails.email,
            phone: updatedDetails.phone,
            password: updatedDetails.password || undefined // Only send if provided
        };

        const { data: updatedStudent } = await updateStudent(userData.studentId || userData._id, updateData);

        const newUserData = {
            ...userData,
            ...updatedStudent,
            name: `${updatedStudent.firstName} ${updatedStudent.lastName}`,
            bio: updatedDetails.bio, // Bio/Avatar/Institute might be local only or stored elsewhere
            avatar: updatedDetails.avatar,
            institute: updatedDetails.institute
        };

        setUserData(newUserData);
        localStorage.setItem('session', JSON.stringify(newUserData));
        return true;
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex font-sans selection:bg-green-500/30 selection:text-green-400 overflow-x-hidden relative">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />

                <main className="flex-1 p-6 lg:p-10 mt-20 max-w-[1400px] mx-auto w-full relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-900/05 rounded-full blur-[120px] z-0 pointer-events-none"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
                        {/* Profile Side */}
                        <div className="space-y-6">
                            <ProfileCard user={userData} onEditClick={() => setIsModalOpen(true)} />
                        </div>

                        {/* Content Side */}
                        <div className="space-y-8">
                            {/* Attendance Heatmap */}
                            <HeatmapSection attendance={userData?.attendance || []} />

                            {/* Quick Access - Smaller Cards */}
                            <section>
                                <div className="flex items-center mb-6">
                                    <span className="w-1 h-6 bg-green-500 rounded-full mr-3 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
                                    <h3 className="text-lg font-bold text-white tracking-tight text-xs uppercase opacity-80">Quick Access</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { title: "Exams", icon: "terminal", path: "/exams", color: "text-blue-400" },
                                        { title: "Courses", icon: "auto_stories", path: "/courses", color: "text-purple-400" },
                                        { title: "Leaderboard", icon: "emoji_events", path: "/leaderboard", color: "text-orange-400" }
                                    ].map((action, i) => (
                                        <Link
                                            key={i}
                                            to={action.path}
                                            className="bg-gray-800/20 p-5 rounded-2xl border border-dashed border-gray-700 hover:border-green-500/40 transition-all group flex items-center gap-4 backdrop-blur-sm"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800 shadow-lg group-hover:scale-110 transition-transform">
                                                <span className={`material-symbols-outlined text-xl ${action.color}`}>{action.icon}</span>
                                            </div>
                                            <h4 className="font-bold text-white text-sm tracking-tight">{action.title}</h4>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {/* Edit Profile Popup */}
            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={userData}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default Dashboard;
