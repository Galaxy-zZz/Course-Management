import React, { useMemo } from 'react';
import { Course } from '../types';
import { getStatusStyles } from '../utils';
import CalendarButton from './CalendarButton';

interface CourseDetailProps {
    course: Course;
    onBack: () => void;
    onSelectCourse: (course: Course) => void;
    allCourses: Course[];
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onSelectCourse, allCourses }) => {
    const statusStyles = getStatusStyles(course.status);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [course]);

    const relatedCourses = useMemo(() => {
        const candidates = allCourses.filter(c => 
            !c.past && 
            c.id !== course.id &&
            c.status !== 'เต็ม' &&
            c.status !== 'เลื่อน' &&
            c.status !== 'ยกเลิก'
        );
        const shuffled = [...candidates].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    }, [course, allCourses]);

    const handleOutlineClick = () => {
        if (course.outlineUrl) {
            window.open(course.outlineUrl, '_blank');
        } else {
            alert('ขออภัย ยังไม่มีไฟล์ Course Outline สำหรับหลักสูตรนี้');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 animate-fade-in">
            <button onClick={onBack} className="group flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                กลับไปหน้าหลักสูตร
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
                <div className="w-full bg-gradient-to-br from-blue-600 to-blue-900 py-8 px-4 flex justify-center items-center">
                    <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                            <h1 className="text-white text-2xl md:text-4xl font-bold">{course.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-3/4 p-6 md:p-10 space-y-10">
                        <div className="bg-gray-50 rounded-xl border p-6">
                             <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-800">ข้อมูลการสัมมนา</h3>
                                <div className="flex items-center gap-2">
                                    {!course.past && <CalendarButton course={course} direction="down" />}
                                    <span className={`text-xs px-2 py-1 rounded text-white ${statusStyles.disabled ? 'bg-gray-400' : 'bg-green-500'}`}>{course.status}</span>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div><span className="text-xs text-gray-500 uppercase block">วันที่</span><span className="font-semibold">{course.date}</span></div>
                                <div><span className="text-xs text-gray-500 uppercase block">เวลา</span><span className="font-semibold">{course.time}</span></div>
                                <div><span className="text-xs text-gray-500 uppercase block">สถานที่</span><span className="font-semibold">{course.location}</span></div>
                             </div>

                             <div className="bg-white p-4 rounded-lg border flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex gap-8">
                                    <div><span className="text-xs text-gray-500 block">สมาชิก</span><span className="text-xl font-bold text-blue-600">{course.priceMember}</span></div>
                                    <div><span className="text-xs text-gray-500 block">บุคคลทั่วไป</span><span className="text-xl font-bold">{course.priceNormal}</span></div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleOutlineClick}
                                        className={`px-6 py-2 border rounded-lg font-bold transition-colors ${course.outlineUrl ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Course Outline
                                    </button>
                                    <button disabled={statusStyles.disabled} className={`px-6 py-2 text-white rounded-lg font-bold shadow ${statusStyles.btn}`}>{statusStyles.btnText}</button>
                                </div>
                             </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 border-b pb-2">รายละเอียดหลักสูตร</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติมสำหรับหลักสูตรนี้'}</p>
                        </section>
                        
                        {course.instructor && course.instructor.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 border-b pb-2">วิทยากร</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {course.instructor.map((inst, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                                            <img src={inst.image} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" alt={inst.name} />
                                            <div>
                                                <h3 className="font-bold text-gray-800">{inst.name}</h3>
                                                <p className="text-sm text-gray-500">วิทยากรผู้เชี่ยวชาญ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:w-1/4 bg-gray-50 p-6 border-l">
                        <h3 className="text-xl font-bold mb-6">หลักสูตรน่าสนใจ</h3>
                        <div className="space-y-4">
                            {relatedCourses.map(c => (
                                <div key={c.id} onClick={() => onSelectCourse(c)} className="bg-white p-3 rounded-lg border shadow-sm cursor-pointer hover:border-blue-300 flex gap-3">
                                    <img src={c.image} className="w-16 h-16 object-cover rounded-lg" />
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-bold line-clamp-2">{c.title}</h4>
                                        <p className="text-xs text-gray-500">{c.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;