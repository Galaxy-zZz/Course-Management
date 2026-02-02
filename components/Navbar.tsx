import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#002b5c] text-white font-sans shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-8 h-[72px] flex justify-between items-center">
                {/* Logo Area */}
                <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="flex items-center gap-3 group select-none">
                    <div className="relative flex items-end">
                        <span className="text-3xl font-bold tracking-wide leading-none">PMAT</span>
                        <div className="flex items-baseline ml-1">
                             {/* Mimic the 60th Anniversary graphic with styled text */}
                            <span className="text-4xl font-bold text-[#c5a059] italic relative font-serif leading-none" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                                60
                            </span>
                            <div className="flex flex-col ml-1 mb-1">
                                <span className="text-[0.6rem] leading-none uppercase tracking-wider text-[#c5a059] font-bold">Anniversary</span>
                            </div>
                        </div>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8 font-medium text-[15px]">
                    <a href="#" className="hover:text-[#c5a059] transition-colors py-2">About</a>
                    <a href="#" className="hover:text-[#c5a059] transition-colors py-2">Member</a>
                    
                    <div className="group relative flex items-center gap-1 cursor-pointer hover:text-[#c5a059] transition-colors py-2">
                        <span>Events & Training</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity transform group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 overflow-hidden border border-gray-100">
                            <a href="#" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-700 transition-colors border-b border-gray-50">Public Training</a>
                            <a href="#" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-700 transition-colors">In-house Training</a>
                        </div>
                    </div>

                    <div className="group relative flex items-center gap-1 cursor-pointer hover:text-[#c5a059] transition-colors py-2">
                        <span>Knowledge</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity transform group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 overflow-hidden border border-gray-100">
                            <a href="#" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-700 transition-colors border-b border-gray-50">Articles</a>
                            <a href="#" className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-700 transition-colors">Resources</a>
                        </div>
                    </div>

                    <a href="#" className="hover:text-[#c5a059] transition-colors py-2">Community</a>
                </div>

                {/* Right Action Button */}
                <div className="hidden lg:block">
                    <a href="#" className="group flex items-center gap-2 border border-white rounded-full px-6 py-2 font-semibold text-sm hover:bg-white hover:text-[#002b5c] transition-all duration-300">
                        Join Us
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>

                {/* Mobile Menu Icon */}
                <button className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;