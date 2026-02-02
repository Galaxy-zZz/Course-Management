import React, { useState, useMemo, useEffect } from 'react';
import { ALL_COURSES as INITIAL_COURSES } from './constants';
import { Course, ViewMode, SortOption } from './types';
import CourseCard from './components/CourseCard';
import CourseDetail from './components/CourseDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { parseCourseDate } from './utils';

const App: React.FC = () => {
    // State
    const [view, setView] = useState<'public' | 'admin'>('public');
    const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('date-asc');
    
    // Filters State
    const [activeCourseType, setActiveCourseType] = useState('all');
    const [filterFormat, setFilterFormat] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Derived Data
    const filteredCourses = useMemo(() => {
        let list = [...courses];

        // 1. Type
        if (activeCourseType !== 'all') {
            list = list.filter(c => c.type === activeCourseType);
        }

        // 2. Format
        if (filterFormat !== 'all') {
            list = list.filter(c => c.format === filterFormat);
        }

        // 3. Category
        if (filterCategory !== 'all') {
            list = list.filter(c => c.category === filterCategory);
        }

        // 4. Date
        if (filterDate !== 'all') {
            if (filterDate === 'January 2026') {
                list = list.filter(c => c.date.includes('January') && c.date.includes('2026'));
            } else {
                list = list.filter(c => c.date.includes(filterDate) && !c.date.includes('January 2026'));
            }
        }

        // 5. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            list = list.filter(c => 
                c.title.toLowerCase().includes(lowerTerm) || 
                c.instructor.some(i => i.name.toLowerCase().includes(lowerTerm))
            );
        }

        // 6. Sort
        list.sort((a, b) => {
            if (sortOption === 'popular') return 0;
            const dateA = parseCourseDate(a.date).getTime();
            const dateB = parseCourseDate(b.date).getTime();
            return sortOption === 'date-asc' ? dateA - dateB : dateB - dateA;
        });

        return list;
    }, [courses, activeCourseType, filterFormat, filterCategory, filterDate, searchTerm, sortOption]);

    const activeCourses = filteredCourses.filter(c => !c.past);
    const pastCourses = filteredCourses.filter(c => c.past);

    const resetFilters = () => {
        setActiveCourseType('all');
        setFilterFormat('all');
        setFilterCategory('all');
        setFilterDate('all');
        setSearchTerm('');
        setSortOption('date-asc');
        setIsFilterPanelOpen(false);
    };

    if (view === 'admin') {
        return <AdminPanel courses={courses} setCourses={setCourses} onExit={() => setView('public')} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sarabun">
            <Navbar />

            {selectedCourse ? (
                 <CourseDetail 
                    course={selectedCourse} 
                    onBack={() => setSelectedCourse(null)} 
                    onSelectCourse={setSelectedCourse}
                    allCourses={courses}
                />
            ) : (
                <div className="container mx-auto p-4 md:p-8 flex-grow">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">หลักสูตรทั้งหมด</h1>

                    {/* Type Filters */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8 pb-4 border-b">
                        {['all', 'Public Training', 'PM', 'APM', 'HR Fundamental', 'Mindfulness', 'Free'].map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveCourseType(type)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    activeCourseType === type 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 border hover:bg-gray-100'
                                }`}
                            >
                                {type === 'all' ? 'All' : type}
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="relative flex-shrink-0 w-full md:w-auto">
                            <button 
                                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                                <span>ตัวกรอง</span>
                            </button>
                            {isFilterPanelOpen && (
                                <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-20 p-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">หมวดคอร์ส</label>
                                        <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                            <option value="all">All</option>
                                            <option value="Onsite">Onsite</option>
                                            <option value="Online">Online</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
                                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                            <option value="all">All</option>
                                            <option value="Career Management">Career Management</option>
                                            <option value="HR Strategy">HR Strategy</option>
                                            <option value="Performance Management">Performance Management</option>
                                            <option value="Recruitment & Selection">Recruitment & Selection</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button onClick={resetFilters} className="px-3 py-1 bg-gray-200 rounded">ล้างค่า</button>
                                        <button onClick={() => setIsFilterPanelOpen(false)} className="px-3 py-1 bg-blue-600 text-white rounded">ใช้</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative w-full md:w-auto md:flex-grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </span>
                            <input 
                                type="text" 
                                placeholder="ค้นหาหลักสูตร..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <select 
                                value={sortOption} 
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="px-4 py-2 border rounded-lg bg-white"
                            >
                                <option value="date-asc">วันที่ น้อย - มาก</option>
                                <option value="date-desc">วันที่ มาก - น้อย</option>
                                <option value="popular">ยอดนิยม</option>
                            </select>
                            <div className="flex gap-2">
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button>
                            </div>
                        </div>
                    </div>

                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : ''}>
                        {activeCourses.map(c => <CourseCard key={c.id} course={c} viewMode={viewMode} onClick={setSelectedCourse} />)}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-16 pt-8 border-t">หลักสูตรที่จัดแล้ว</h1>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : ''}>
                        {pastCourses.map(c => <CourseCard key={c.id} course={c} viewMode={viewMode} onClick={setSelectedCourse} />)}
                    </div>
                </div>
            )}
            <Footer onAdminClick={() => setView('admin')} />
        </div>
    );
};

export default App;