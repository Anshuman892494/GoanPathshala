import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { APP_NAME } from '../utils/constants';

const Courses = () => {
    const courseList = [
        {
            title: "O Level (NIELIT)",
            description: "Information Technology (IT) Tools and Network Basics, Web Designing & Publishing, Python Programming and IoT.",
            duration: "1 Year",
            icon: "computer"
        },
        {
            title: "ADCA (Advanced Diploma in Computer Applications)",
            description: "Comprehensive course covering Office Automation, Graphic Designing, Web Development, and Financial Accounting.",
            duration: "1 Year",
            icon: "data_object"
        },
        {
            title: "DCA (Diploma in Computer Applications)",
            description: "Foundational computer skills for building a career in modern IT environments.",
            duration: "6 Months",
            icon: "apps"
        },
        {
            title: "Tally Prime",
            description: "Professional accounting with GST implementation, payroll management, and inventory tracking.",
            duration: "3 Months",
            icon: "account_balance_wallet"
        },
        {
            title: "OMC (Office Management Course)",
            description: "Essential skills for managing modern office operations effectively using digital tools.",
            duration: "3 Months",
            icon: "work"
        },
        {
            title: "CCC (Course on Computer Concepts)",
            description: "A digital literacy course providing basic computer knowledge for various entrance exams and jobs.",
            duration: "3 Months",
            icon: "verified_user"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />
                <main className="p-8 mt-20">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tighter">
                            Our Specialized <span className="text-green-500">Programs</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light">
                            Explore our comprehensive list of professional computer courses designed to make you industry-ready.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {courseList.map((course, index) => (
                            <div key={index} className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-green-500/50 transition-all group relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-7xl">{course.icon}</span>
                                </div>
                                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                                    <span className="material-symbols-outlined text-green-500 text-3xl">{course.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{course.title}</h3>
                                <p className="text-gray-400 font-light mb-6 flex-1 leading-relaxed">{course.description}</p>
                                <div className="flex items-center text-sm font-medium text-green-400 bg-green-900/20 w-fit px-4 py-2 rounded-full border border-green-500/20">
                                    <span className="material-symbols-outlined text-sm mr-2">schedule</span>
                                    Duration: {course.duration}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-12 text-center border border-gray-700 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-transparent"></div>
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Ready to start your journey?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Enroll today and join over 1,000+ students already learning with {APP_NAME}Pathshala.</p>
                        <button className="bg-green-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-green-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-900/20 inline-flex items-center gap-2 uppercase tracking-wider">
                            Enroll Now
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Courses;
