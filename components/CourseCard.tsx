import React from 'react';
import { Course, ViewMode } from '../types';
import { getStatusStyles } from '../utils';
import CalendarButton from './CalendarButton';

interface CourseCardProps {
    course: Course;
    viewMode: ViewMode;
    onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, viewMode, onClick }) => {
    const statusStyles = getStatusStyles(course.status);
    const isList = viewMode === 'list';
    
    // Instructor Component
    const InstructorSection = () => {
        if (!course.instructor || course.instructor.length === 0) return null;
        
        return (
            <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2 overflow-hidden">
                    {course.instructor.slice(0, 3).map((inst, i) => (
                        <img 
                            key={i}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" 
                            src={inst.image} 
                            alt={inst.name} 
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/cccccc/ffffff?text=?'; }}
                        />
                    ))}
                    {course.instructor.length > 3 && (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-medium text-gray-500">
                            +{course.instructor.length - 3}
                        </div>
                    )}
                </div>
                <span className="text-xs text-gray-600 truncate max-w-[120px]">
                    {course.instructor[0].name}{course.instructor.length > 1 ? ' และคณะ' : ''}
                </span>
            </div>
        );
    };

    return (
        <div 
            onClick={() => onClick(course)}
            className={`course-card relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group ${isList ? 'md:flex-row mb-6' : 'h-full'} ${course.past ? 'opacity-70' : ''}`}
        >
            <div className={`flex-shrink-0 relative overflow-hidden ${isList ? 'w-full md:w-48 aspect-square' : 'aspect-video'} rounded-t-xl ${isList ? 'md:rounded-tr-none md:rounded-l-xl' : ''}`}>
                 <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                    {course.type}
                 </div>
                 <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={course.image} 
                    alt={course.title}
                 />
                 <div className="absolute top-2 right-2 z-10">
                    <span className={`text-white text-[10px] font-bold px-2 py-1 rounded-full ${course.format === 'Online' ? 'bg-indigo-600' : 'bg-green-600'}`}>
                        {course.format}
                    </span>
                 </div>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                        {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                        {course.title}
                    </h3>
                    <InstructorSection />
                </div>

                <div className={`mt-4 flex flex-col ${isList ? 'md:flex-row md:items-center md:justify-between' : ''} gap-4`}>
                    <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {course.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {course.location}
                        </div>
                    </div>

                    <div className={`flex items-center gap-4 ${isList ? 'md:border-l md:pl-6' : 'border-t pt-4'}`}>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">สมาชิก</span>
                            <span className="text-sm font-bold text-blue-600">{course.priceMember}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">บุคคลทั่วไป</span>
                            <span className="text-sm font-bold text-gray-700">{course.priceNormal}</span>
                        </div>
                        <div className="flex gap-2 ml-auto">
                             {!course.past && <CalendarButton course={course} direction="up" />}
                             <button disabled={statusStyles.disabled} className={`px-4 py-2 rounded-lg text-white font-bold text-sm transition-all transform active:scale-95 ${statusStyles.btn}`}>
                                {statusStyles.btnText}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;