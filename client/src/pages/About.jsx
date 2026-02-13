import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { APP_NAME } from '../utils/constants';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Sidebar />
            <nav className="bg-gray-800 shadow-lg px-8 py-5 flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-20 text-white mb-8 border-b border-gray-700 ml-64">
                <div className="flex items-center space-x-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight">About Institute</h1>
                </div>
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors font-medium border border-gray-600/50 px-4 py-2 rounded-lg hover:bg-gray-700/50">
                    Back
                </button>
            </nav>

            <div className="flex-1 ml-64 mt-20 p-8">
                <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                    <div className="relative h-64 bg-gradient-to-r from-red-900 to-gray-900 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                        <div className="relative z-10 text-center">
                            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">{APP_NAME}</h1>
                            <p className="text-xl text-red-200 font-medium tracking-wide">Advance Computer Career Institute</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 hover:border-red-500/50 transition-colors">
                                <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                                    Our Mission
                                </h2>
                                <p className="text-gray-400">
                                    अब हमारा शिक्षण तंत्र ऑनलाइन प्लेटफ़ॉर्म पर उपलब्ध है, जिससे छात्र कहीं से भी, किसी भी समय पढ़ाई कर सकते हैं। डिजिटल स्टडी मटीरियल, ऑनलाइन टेस्ट और परफ़ॉर्मेंस एनालिसिस जैसी सुविधाएँ छात्रों की तैयारी को अधिक प्रभावी और परिणाम-उन्मुख बनाती हैं।</p>
                            </section>

                            <section className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 hover:border-red-500/50 transition-colors">
                                <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                                    Courses Offered
                                </h2>
                                <ul className="list-disc list-inside text-gray-400 space-y-2">
                                    <li>CCC (NIELIT)</li>
                                    <li>O Level (NIELIT)</li>
                                    <li>ADCA</li>
                                    <li>DCA</li>
                                    <li>Tally Prime</li>
                                    <li>OMC </li>
                                </ul>
                            </section>
                        </div>

                        <section className="bg-gray-700/50 p-8 rounded-xl border border-gray-600">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                Contact Information
                            </h2>
                            <div className="space-y-4 text-gray-300">
                                <div className="flex items-start">
                                    <span className="font-semibold w-24 text-gray-400">Manager:</span>
                                    <span>Mr. Seetaram Nishad</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="font-semibold w-24 text-gray-400">Address:</span>
                                    <span>In front of Balrampur Police Chowki, Azamgarh, Uttar Pradesh, 276001</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24 text-gray-400">Email:</span>
                                    <span>acci3999@gmail.com</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24 text-gray-400">Website:</span>
                                    <a href="https://acciazm.iteducation.in" target="_blank" className="text-red-400 hover:underline">https://acciazm.iteducation.in</a>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24 text-gray-400">Phone:</span>
                                    <span className="text-gray-200">+91 9889926155, +91 8546089999</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Developer Info */}
                    <div className="bg-gray-800/80 p-6 text-center border-t border-gray-700 flex flex-col items-center justify-center space-y-2">
                        <p className="text-gray-500 text-sm">Designed & Developed by</p>
                        <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-red-500">code</span>
                            <span className="text-gray-300 font-semibold tracking-wide">Anshuman Verma</span>
                        </div>
                        <p className="text-gray-600 text-xs mt-1 underline"><a href="https://anshuman-ten.vercel.app/" target="_blank" rel="noopener noreferrer">For more information visit my website</a></p>
                    </div>

                    <div className="bg-gray-900/50 p-4 text-center border-t border-gray-800 text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} Advance Computer Career Institute. All Rights Reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
