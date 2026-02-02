import React, { useState, useRef, useEffect } from 'react';
import { Course } from '../types';
import { generateGoogleCalendarUrl, downloadIcs } from '../utils';

interface CalendarButtonProps {
    course: Course;
    className?: string;
    label?: string;
    direction?: 'up' | 'down';
}

const CalendarButton: React.FC<CalendarButtonProps> = ({ course, className = '', label, direction = 'up' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleGoogleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(generateGoogleCalendarUrl(course), '_blank');
        setIsOpen(false);
    };

    const handleOutlookClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        downloadIcs(course);
        setIsOpen(false);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const isUp = direction === 'up';

    return (
        <div className={`relative ${className}`} ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={toggleMenu}
                className={`flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm ${label ? 'w-full md:w-auto' : ''}`}
                title="Add to Calendar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {label && <span className="font-bold">{label}</span>}
            </button>

            {isOpen && (
                <div className={`absolute ${isUp ? 'bottom-full mb-3' : 'top-full mt-3'} left-1/2 transform -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-fade-in ${isUp ? 'origin-bottom' : 'origin-top'}`}>
                     <button
                        onClick={handleGoogleClick}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 border-b border-gray-50 last:border-0"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Google Calendar
                    </button>
                    <button
                        onClick={handleOutlookClick}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Outlook / iCal
                    </button>
                    {/* Triangle pointer */}
                     <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent ${isUp ? '-bottom-2 border-t-8 border-t-white' : '-top-2 border-b-8 border-b-white'}`}></div>
                </div>
            )}
        </div>
    );
};

export default CalendarButton;