import React, { useState, useEffect, useMemo } from 'react';
import { Course, Instructor, TrainingSession, Registration } from '../types';

interface AdminPanelProps {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    onExit: () => void;
}

interface TicketConfirmation {
    no: number;
    ticketId: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
    status: 'Sent' | 'Confirmed' | 'Failed';
}

const MASTER_INSTRUCTORS: Instructor[] = [
    { name: 'ผศ.ดร.สมบูรณ์ กุลวิเศษชนะ', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'สุวิช นุกูลสุทธิศิริ', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'สุวรรณา กิตติรัตน์พัฒนา', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'ดร. ชัยชนะ เลิศปัญญา', image: 'https://randomuser.me/api/portraits/men/85.jpg' },
    { name: 'อ. จิตรา เข้าใจ', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'คุณ พัฒนา อบรมดี', image: 'https://randomuser.me/api/portraits/men/36.jpg' }
];

const ADMIN_USERS = [
    'Super Admin',
    'คุณ ณัฐวุฒิ (L&D Manager)',
    'คุณ พิมลดา (Course Coordinator)',
    'คุณ สิทธิชัย (HR Specialist)',
    'คุณ วรรณวิสา (Admin Support)'
];

const INITIAL_LOCATIONS = [
    "Amari Hotel",
    "The Emeral Hotel",
    "Centaragrand at Central Ladphrao",
    "Zoom Meeting"
];

const MOCK_REGISTRATIONS: Registration[] = [
    { name: 'ปนัดดา พัดชา', email: 'panadda.pat@kp-sugargroup.com', phone: '0819319291', organization: 'บริษัท น้ำตาลเกษตรผล จำกัด', status: 'Pending', remark: '-', isMember: true },
    { name: 'สมรดี รัตนา', email: 'samorn.r@finance-pro.co.th', phone: '0821112222', organization: 'Finance Pro Services', status: 'Pending', remark: '-', isMember: true },
    { name: 'วิชัย ชัยชนะ', email: 'wichai.c@industry-plus.com', phone: '0833334444', organization: 'Industry Plus Group', status: 'Pending', remark: '-', isMember: false },
    { name: 'กิตติศักดิ์ มาดี', email: 'kitti.m@smart-logistics.com', phone: '0845556666', organization: 'Smart Logistics Ltd.', status: 'Pending', remark: '-', isMember: true },
    { name: 'ชลธิชา นรินทร์', email: 'chonthicha@creative-agency.net', phone: '0857778888', organization: 'Creative Agency TH', status: 'Pending', remark: '-', isMember: false },
    { name: 'ธนากร สุขสันต์', email: 'thanakorn.s@energy-corp.com', phone: '0869990000', organization: 'Energy Corp International', status: 'Pending', remark: '-', isMember: true },
    { name: 'วรัญญา ใจดี', email: 'waranya.j@hr-solutions.co.th', phone: '0871113333', organization: 'HR Solutions Thailand', status: 'Pending', remark: '-', isMember: true },
    { name: 'ประเสริฐ เลิศวานิช', email: 'prasert.l@retail-giant.com', phone: '0882224444', organization: 'Retail Giant PCL', status: 'Pending', remark: '-', isMember: false },
    { name: 'อมรรัตน์ สดใส', email: 'amorn.s@tech-start.io', phone: '0893335555', organization: 'Tech Start IO', status: 'Pending', remark: '-', isMember: true }
];

const MOCK_TICKET_CONFIRMATIONS: TicketConfirmation[] = [
    { no: 1, ticketId: 'TKT-2026-045', name: 'กิตติภูมิ รักไทย', email: 'kittipoom.r@company.co.th', phone: '081-234-5678', organization: 'บริษัท ไทยฟู้ดส์ จำกัด', status: 'Confirmed' },
    { no: 2, ticketId: 'TKT-2026-046', name: 'วิไลลักษณ์ มั่นคง', email: 'wilai.m@global-logistics.com', phone: '082-345-6789', organization: 'Global Logistics Solutions', status: 'Sent' },
    { no: 3, ticketId: 'TKT-2026-047', name: 'ธนวัฒน์ สุขสำราญ', email: 'thanawat.s@tech-inno.io', phone: '083-456-7890', organization: 'Tech Innovators TH', status: 'Confirmed' },
    { no: 4, ticketId: 'TKT-2026-048', name: 'ศิริพร ใจบุญ', email: 'siriporn.j@health-care.net', phone: '084-567-8901', organization: 'ศูนย์การแพทย์เพื่อสุขภาพ', status: 'Sent' },
    { no: 5, ticketId: 'TKT-2026-049', name: 'ประเสริฐ เลิศวิไล', email: 'prasert.l@finance-guru.com', phone: '085-678-9012', organization: 'Finance Guru Asset', status: 'Confirmed' }
];

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, setCourses, onExit }) => {
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedInstructors, setSelectedInstructors] = useState<Instructor[]>([]);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isPublished, setIsPublished] = useState(true);
    const [onlySubscription, setOnlySubscription] = useState(false);
    const [accessType, setAccessType] = useState<'system' | 'external'>('system');
    const [descTab, setDescTab] = useState<'th' | 'en' | 'outline' | 'lecturer' | 'remark' | 'logs' | 'setting'>('th');
    const [bottomTab, setBottomTab] = useState<'registration' | 'confirmation'>('registration');
    const [adminViewMode, setAdminViewMode] = useState<'all' | 'my'>('all');
    const [adminTypeTab, setAdminTypeTab] = useState<'training' | 'event' | 'lms'>('training');
    const [isSaved, setIsSaved] = useState(false);
    
    // Training Location State
    const [availableLocations, setAvailableLocations] = useState<string[]>(INITIAL_LOCATIONS);
    const [locationMode, setLocationMode] = useState<'preset' | 'custom'>('preset');
    const [locationValue, setLocationValue] = useState('');
    
    // Confirmation Dialog state
    const [confirmAction, setConfirmAction] = useState<{ type: 'Confirm' | 'Cancel', regName: string } | null>(null);

    const currentUser = 'Super Admin';

    // Load preference on mount
    useEffect(() => {
        const savedView = localStorage.getItem('adminViewModePreference');
        if (savedView === 'all' || savedView === 'my') {
            setAdminViewMode(savedView);
        }
        
        // Load custom locations if any
        const savedLocs = localStorage.getItem('adminAvailableLocations');
        if (savedLocs) {
            setAvailableLocations(JSON.parse(savedLocs));
        }
    }, []);

    const handleSavePreference = () => {
        localStorage.setItem('adminViewModePreference', adminViewMode);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleSaveNewLocation = () => {
        if (!locationValue.trim()) return;
        
        const newLocs = [...availableLocations];
        if (!newLocs.includes(locationValue)) {
            newLocs.push(locationValue);
            setAvailableLocations(newLocs);
            localStorage.setItem('adminAvailableLocations', JSON.stringify(newLocs));
        }
        setLocationMode('preset');
    };

    const filteredCourses = useMemo(() => {
        if (adminViewMode === 'my') {
            return courses.filter(c => c.owner === currentUser);
        }
        return courses;
    }, [courses, adminViewMode]);

    useEffect(() => {
        if (editingCourse) {
            setPreviewImage(editingCourse.image || '');
            setIsPublished(editingCourse.publish ?? true);
            setOnlySubscription(editingCourse.onlySubscription ?? false);
            setSelectedInstructors(editingCourse.instructor || []);
            setAccessType(editingCourse.sessions?.[0]?.accessType || 'system');
            
            const currentLoc = editingCourse.location || '';
            if (availableLocations.includes(currentLoc) || currentLoc === '') {
                setLocationMode('preset');
                setLocationValue(currentLoc);
            } else {
                setLocationMode('preset');
                setLocationValue(currentLoc);
            }
        } else {
            setPreviewImage('');
            setIsPublished(true);
            setOnlySubscription(false);
            setSelectedInstructors([]);
            setAccessType('system');
            setLocationMode('preset');
            setLocationValue('');
        }
    }, [editingCourse, isAdding, availableLocations]);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const courseData: Partial<Course> = {
            itemCode: formData.get('itemCode') as string,
            title: formData.get('title') as string,
            titleEn: formData.get('titleEn') as string,
            date: formData.get('date') as string,
            status: formData.get('status') as Course['status'],
            priceMember: formData.get('priceMember') as string,
            priceNormal: formData.get('priceNormal') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            descriptionEn: formData.get('descriptionEn') as string,
            outlineUrl: formData.get('outlineUrl') as string,
            format: formData.get('format') as any,
            type: formData.get('type') as string,
            location: locationValue,
            image: previewImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            publish: isPublished,
            onlySubscription: onlySubscription,
            instructor: selectedInstructors,
            owner: formData.get('owner') as string
        };

        if (editingCourse) {
            setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } : c));
        } else {
            const newCourse: Course = {
                id: Date.now(),
                ...courseData as Course,
                past: false,
                time: '09:00-16:00',
            };
            setCourses([newCourse, ...courses]);
        }
        setEditingCourse(null);
        setIsAdding(false);
    };

    const inputClasses = "w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white transition-colors";
    const selectClasses = "w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors";
    const radioClasses = "w-4 h-4 border border-black bg-white accent-black cursor-pointer";

    const renderConfirmPopup = () => {
        if (!confirmAction) return null;
        const isConfirm = confirmAction.type === 'Confirm';
        
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${isConfirm ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isConfirm ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">ยืนยันรายการ</h3>
                    <p className="text-gray-500 text-center mb-8">คุณต้องการที่จะ <span className={isConfirm ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{isConfirm ? 'ยืนยันบัตร (Ticket Confirm)' : 'ยกเลิกรายการ (Cancel)'}</span> ของคุณ <span className="font-bold text-gray-800">{confirmAction.regName}</span> ใช่หรือไม่?</p>
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setConfirmAction(null)}
                            className="flex-1 px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            ไม่ใช่, ปิด
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                alert(`${confirmAction.type}ed successfully for ${confirmAction.regName}`);
                                setConfirmAction(null);
                            }}
                            className={`flex-1 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${isConfirm ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            ใช่, ดำเนินการ
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sarabun text-[#444]">
            {renderConfirmPopup()}
            
            {/* Main Header Row */}
            <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
                <h1 className="text-2xl font-bold text-[#1e293b]">Course Management</h1>
                <div className="flex items-center gap-4">
                    <button onClick={onExit} className="text-sm font-bold text-gray-500 hover:text-gray-700">Exit Admin</button>
                    <div className="w-10 h-10 rounded-full bg-[#7c2d12] flex items-center justify-center text-white font-bold text-sm border-2 border-green-500 relative">
                        TK
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto p-8 space-y-8">
                {/* Auto Refresh Row */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors duration-200 focus:outline-none">
                                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></span>
                            </button>
                            <span className="text-sm text-gray-600 font-medium">Auto-refresh</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Last updated: Jan 8, 2026, 03:03 PM (2m ago)
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">All Training</p>
                            <h2 className="text-4xl font-bold text-gray-900">{courses.length}</h2>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">All Event</p>
                            <h2 className="text-4xl font-bold text-gray-900">5</h2>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">All LMS</p>
                            <h2 className="text-4xl font-bold text-gray-900">78</h2>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Sub Header & Tabs Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
                        {['training', 'event', 'lms'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setAdminTypeTab(tab as any)}
                                className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    adminTypeTab === tab 
                                    ? 'bg-[#f1f5f9] text-[#0ea5e9]' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold">
                        <span className="text-gray-400">View &gt;</span>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setAdminViewMode('all')}
                                className={adminViewMode === 'all' ? 'text-gray-900 underline underline-offset-4' : 'text-gray-400 hover:text-gray-600 transition-colors'}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setAdminViewMode('my')}
                                className={adminViewMode === 'my' ? 'text-gray-900 underline underline-offset-4' : 'text-gray-400 hover:text-gray-600 transition-colors'}
                            >
                                My Owner
                            </button>
                            <button 
                                onClick={handleSavePreference}
                                className={`ml-2 px-3 py-1 text-[10px] font-bold border rounded-lg transition-all flex items-center gap-1.5 ${
                                    isSaved 
                                    ? 'bg-green-50 text-green-600 border-green-200' 
                                    : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                                }`}
                                title="Save current view as default"
                            >
                                {isSaved ? (
                                    <>
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                        Saved
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z"/></svg>
                                        บันทึก
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area (Table Card) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">All Training</h3>
                            <button 
                                onClick={() => setIsAdding(true)} 
                                className="bg-[#002b5c] text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-all shadow-md active:scale-95 flex items-center gap-2"
                            >
                                <span className="text-xl">+</span> Create New
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-8 flex items-center gap-0 group">
                                <div className="relative flex-grow">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </span>
                                    <input 
                                        type="text" 
                                        placeholder="Input search text" 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                                    />
                                </div>
                                <button className="px-6 py-2 bg-[#002b5c] text-white font-bold text-sm rounded-r-lg hover:bg-blue-900 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    Search
                                </button>
                            </div>
                            <div className="md:col-span-2">
                                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5h18M5 9h14M7 13.5h10M9 18h6" /></svg>
                                        Filters
                                    </div>
                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>
                            <div className="md:col-span-2">
                                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                                    Columns
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#fcfdfe] text-[#1e293b] text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 w-12">#</th>
                                    <th className="px-6 py-4">Item Code/Training Name</th>
                                    <th className="px-6 py-4">Start-End Date</th>
                                    <th className="px-6 py-4">Categories</th>
                                    <th className="px-6 py-4">Participant</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredCourses.map((course, index) => (
                                    <tr key={course.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-6 py-6 text-sm text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-[#1e293b] group-hover:text-blue-600 transition-colors text-[13px]">{course.itemCode || 'TRA68-XXXX'}</div>
                                            <div className="text-[13px] text-gray-900 font-bold mt-1">{course.title}</div>
                                        </td>
                                        <td className="px-6 py-6 text-[12px] text-gray-600 whitespace-nowrap">
                                            {course.date.includes('-') ? course.date : `${course.date} - ${course.date}`}
                                        </td>
                                        <td className="px-6 py-6 text-[12px] text-gray-600">{course.category}</td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="text-[14px] font-bold text-gray-900">10/60</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                course.status === 'เปิดรับสมัคร' ? 'bg-green-50 text-green-600 border border-green-100' : 
                                                course.status === 'เต็ม' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-gray-50 text-gray-400 border border-gray-200'
                                            }`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                onClick={() => setEditingCourse(course)} 
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">No courses found matching criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-[#fcfdfe] border-t border-gray-50 flex justify-end items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled>&lt;</button>
                            <span className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 text-blue-600 rounded font-bold shadow-sm">1</span>
                            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled>&gt;</button>
                        </div>
                        <select className="border border-gray-200 rounded px-2 py-1 outline-none bg-white text-xs font-medium" defaultValue="50">
                            <option value="50">50 / page</option>
                        </select>
                    </div>
                </div>
            </div>

            {(editingCourse || isAdding) && (
                <div className="fixed inset-0 bg-[#f8f9fc] z-[60] overflow-y-auto animate-fade-in flex flex-col">
                    <form onSubmit={handleSave} className="flex-grow flex flex-col">
                        <div className="sticky top-0 bg-white border-b px-8 py-4 flex justify-between items-center z-10 shadow-sm">
                            <h2 className="text-xl font-bold text-[#002b5c]">{editingCourse ? 'Update Course Details' : 'Create New Course'}</h2>
                            <button type="button" onClick={() => { setEditingCourse(null); setIsAdding(false); }} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        </div>

                        <div className="max-w-6xl mx-auto w-full p-8 space-y-12">
                            {/* Course Form Details (Same as original) */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-4 space-y-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Cover Image*</label>
                                    <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group relative">
                                        {previewImage ? (
                                            <img src={previewImage} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        )}
                                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold text-sm">Change Image</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setPreviewImage(reader.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }} />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Complete Your Image</h3>
                                        <p className="text-xs text-gray-400">Upload an image to visually represent this asset.</p>
                                    </div>
                                </div>
                                <div className="md:col-span-8 space-y-6">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">Publish :</span>
                                            <input type="checkbox" checked={isPublished} onChange={() => setIsPublished(!isPublished)} className="w-5 h-5 accent-[#002b5c]" />
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-[200px]">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Item Code (เช่น TRA69-001)</label>
                                            <input 
                                                name="itemCode" 
                                                defaultValue={editingCourse?.itemCode} 
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="TRA69-XXX"
                                            />
                                        </div>
                                        <div className="ml-auto flex flex-col gap-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Only Subscription:*</span>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" checked={onlySubscription} onChange={() => setOnlySubscription(true)} className={radioClasses} /> Yes</label>
                                                <label className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" checked={!onlySubscription} onChange={() => setOnlySubscription(false)} className={radioClasses} /> No</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase">Training Name (Thai) *</label>
                                            <input name="title" defaultValue={editingCourse?.title} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase">Training Name (English)</label>
                                            <input name="titleEn" defaultValue={editingCourse?.titleEn} className={inputClasses} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Categories *</label>
                                                <select name="category" defaultValue={editingCourse?.category} className={selectClasses}>
                                                    <option>Learning & Development</option>
                                                    <option>Performance Management</option>
                                                    <option>HR Strategy</option>
                                                    <option>Employee Relations</option>
                                                    <option>Recruitment & Selection</option>
                                                    <option>Workforce Planning</option>
                                                    <option>Career Management</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Learning Type *</label>
                                                <select name="format" defaultValue={editingCourse?.format} className={selectClasses}>
                                                    <option>Online on ZOOM</option>
                                                    <option>Onsite at Hotel</option>
                                                    <option>Onsite</option>
                                                    <option>Online</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Training Type</label>
                                                <select name="type" defaultValue={editingCourse?.type} className={selectClasses}>
                                                    <option>Certificate Program</option>
                                                    <option>Public Training</option>
                                                    <option>PM</option>
                                                    <option>APM</option>
                                                    <option>HR Fundamental</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Updated Tabs and Registration/Confirmation Tables */}
                            <div className="space-y-0">
                                <div className="flex border-b">
                                    <button 
                                        type="button" 
                                        onClick={() => setBottomTab('registration')} 
                                        className={`px-8 py-3 text-sm font-bold transition-all border-b-2 ${bottomTab === 'registration' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Registration List (รายชื่อผู้ลงทะเบียน)
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setBottomTab('confirmation')} 
                                        className={`px-8 py-3 text-sm font-bold transition-all border-b-2 ${bottomTab === 'confirmation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Ticket Confirmation List (รายชื่อการส่งบัตร/ยืนยัน)
                                    </button>
                                </div>

                                <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100 overflow-hidden min-h-[400px]">
                                    {bottomTab === 'registration' && (
                                        <div className="animate-fade-in">
                                            <div className="flex justify-between items-center px-6 py-4">
                                                <h3 className="text-lg font-bold text-[#002b5c]">Registration List</h3>
                                                <button type="button" className="bg-[#002b5c] text-white px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> 
                                                    Export CSV
                                                </button>
                                            </div>
                                            <table className="w-full text-left">
                                                <thead className="bg-[#f8f9fb] text-[11px] font-bold text-gray-500 border-b">
                                                    <tr>
                                                        <th className="px-6 py-4">NO.</th>
                                                        <th className="px-6 py-4">ชื่อผู้อบรม</th>
                                                        <th className="px-6 py-4">Email</th>
                                                        <th className="px-6 py-4">โทรศัพท์</th>
                                                        <th className="px-6 py-4">Organization</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-center">Manage</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs divide-y divide-gray-50">
                                                    {MOCK_REGISTRATIONS.map((reg, i) => (
                                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                                                            <td className="px-6 py-4 text-gray-900 font-medium">{reg.name}</td>
                                                            <td className="px-6 py-4 text-blue-500">{reg.email}</td>
                                                            <td className="px-6 py-4 text-gray-900">{reg.phone}</td>
                                                            <td className="px-6 py-4 text-gray-900">{reg.organization}</td>
                                                            <td className="px-6 py-4"><span className="bg-[#fff8e5] text-[#fbbf24] px-2 py-0.5 rounded font-bold">Pending</span></td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <button type="button" onClick={() => setConfirmAction({ type: 'Confirm', regName: reg.name })} className="text-green-600 hover:text-green-800 font-bold text-[11px] uppercase underline">Ticket Confirm</button>
                                                                    <button type="button" onClick={() => setConfirmAction({ type: 'Cancel', regName: reg.name })} className="text-red-500 hover:text-red-700 font-bold text-[11px] uppercase underline">Cancel</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {bottomTab === 'confirmation' && (
                                        <div className="animate-fade-in">
                                            <div className="flex justify-between items-center px-6 py-4">
                                                <h3 className="text-lg font-bold text-[#002b5c]">Ticket Confirmation List</h3>
                                                <div className="flex items-center gap-3">
                                                    <button type="button" className="bg-[#002b5c] text-white px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> 
                                                        Export CSV
                                                    </button>
                                                    <button type="button" className="text-blue-600 text-xs font-bold hover:underline">Resend All Tickets</button>
                                                </div>
                                            </div>
                                            <table className="w-full text-left">
                                                <thead className="bg-[#f8f9fb] text-[10px] font-bold text-gray-500 uppercase border-b">
                                                    <tr>
                                                        <th className="px-6 py-4">No.</th>
                                                        <th className="px-6 py-4">Ticket ID</th>
                                                        <th className="px-6 py-4">ชื่อผู้อบรม</th>
                                                        <th className="px-6 py-4">Email (ผู้อบรม)</th>
                                                        <th className="px-6 py-4">โทรศัพท์ (ผู้อบรม)</th>
                                                        <th className="px-6 py-4">Organization</th>
                                                        <th className="px-6 py-4 text-center">STATUS</th>
                                                        <th className="px-6 py-4 text-center">Manage</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-xs">
                                                    {MOCK_TICKET_CONFIRMATIONS.map((ticket, i) => (
                                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4 text-gray-400 font-medium">{ticket.no}</td>
                                                            <td className="px-6 py-4 font-bold text-gray-900">{ticket.ticketId}</td>
                                                            <td className="px-6 py-4 text-gray-900 font-medium">{ticket.name}</td>
                                                            <td className="px-6 py-4 text-blue-500">{ticket.email}</td>
                                                            <td className="px-6 py-4 text-gray-900">{ticket.phone}</td>
                                                            <td className="px-6 py-4 text-gray-900">{ticket.organization}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`px-2 py-0.5 rounded font-bold ${
                                                                    ticket.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                                                }`}>
                                                                    {ticket.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <button type="button" className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase underline">Resend</button>
                                                                    <button type="button" className="text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t p-6 flex justify-center gap-4 z-20">
                            <button type="button" onClick={() => { setEditingCourse(null); setIsAdding(false); }} className="px-10 py-2 border border-gray-300 rounded-md font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="submit" className="px-12 py-2 bg-[#002b5c] text-white rounded-md font-bold hover:bg-blue-900 shadow-lg transition-all active:scale-95">Update</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;