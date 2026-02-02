import { Course } from './types';

export const parseCourseDate = (dateString: string): Date => {
    // Guard against null, undefined, or empty string
    if (!dateString) return new Date(0); 
    
    // Fix bug: Handle date ranges like "15-25 November 2026" or "10 - 20 December 2026"
    // Strategy: Extract the month and year from the end, and the first day number from the beginning.
    
    const parts = dateString.trim().split(/\s+/);
    if (parts.length < 3) return new Date(dateString); // Fallback for simple dates or unexpected formats

    const year = parts[parts.length - 1];
    const month = parts[parts.length - 2];
    
    // Get the first part (day) and handle ranges with '-'
    let day = parts[0];
    if (day.includes('-')) {
        day = day.split('-')[0];
    }

    const cleanDateString = `${day} ${month} ${year}`;
    const parsedDate = new Date(cleanDateString);

    // If still invalid, try the original string
    if (isNaN(parsedDate.getTime())) {
        return new Date(dateString);
    }

    return parsedDate;
};

export const getStatusStyles = (status: string) => {
    switch (status) {
        case 'เปิดรับสมัคร': return { btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-600', btnText: 'ลงทะเบียน', disabled: false };
        case 'เลื่อน': return { btn: 'bg-orange-500 cursor-not-allowed', text: 'text-orange-600', btnText: 'เลื่อน', disabled: true };
        case 'เต็ม': return { btn: 'bg-gray-400 cursor-not-allowed', text: 'text-red-600', btnText: 'เต็มแล้ว', disabled: true };
        case 'ยกเลิก': return { btn: 'bg-red-600 cursor-not-allowed', text: 'text-red-700', btnText: 'ยกเลิก', disabled: true };
        case 'จัดไปแล้ว': return { btn: 'bg-gray-400 cursor-not-allowed', text: 'text-gray-600', btnText: 'เสร็จสิ้น', disabled: true };
        default: return { btn: 'bg-gray-400', text: 'text-gray-600', btnText: 'เร็วๆ นี้', disabled: true };
    }
};

// Calendar Utilities

const getEventDateTime = (dateStr: string, timeStr: string) => {
    const months: {[key: string]: number} = {
        "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
        "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
    };
    
    if (!dateStr) return null;
    let cleanDateStr = dateStr.replace(/\s+/g, ' ').trim();
    
    // Extract Year
    const yearMatch = cleanDateStr.match(/(\d{4})$/);
    if (!yearMatch) return null;
    const year = parseInt(yearMatch[1]);
    
    // Remove year
    const dateWithoutYear = cleanDateStr.replace(year.toString(), '').trim();
    
    // Find month
    let monthIndex = -1;
    for (const m of Object.keys(months)) {
        if (dateWithoutYear.includes(m)) {
            monthIndex = months[m];
            break;
        }
    }
    if (monthIndex === -1) return null;

    // Remove month to get days
    const dayPart = dateWithoutYear.replace(Object.keys(months).find(m => dateWithoutYear.includes(m)) || '', '').trim();
    
    let startDay = 1, endDay = 1;
    const rangeMatch = dayPart.match(/(\d+)\s*[-]\s*(\d+)/);
    const singleMatch = dayPart.match(/(\d+)/);
    
    if (rangeMatch) {
        startDay = parseInt(rangeMatch[1]);
        endDay = parseInt(rangeMatch[2]);
    } else if (singleMatch) {
        startDay = parseInt(singleMatch[1]);
        endDay = startDay;
    }

    const startDate = new Date(year, monthIndex, startDay);
    const endDate = new Date(year, monthIndex, endDay);

    // Time: "09:00-16:00"
    const [startTime, endTime] = timeStr.split('-').map(t => t.trim());
    const [startH, startM] = (startTime || "09:00").split(':').map(Number);
    const [endH, endM] = (endTime || "17:00").split(':').map(Number);

    startDate.setHours(startH || 9, startM || 0);
    endDate.setHours(endH || 17, endM || 0);
    
    return { start: startDate, end: endDate };
};

export const generateGoogleCalendarUrl = (course: Course) => {
    const dates = getEventDateTime(course.date, course.time);
    if (!dates) return '#';
    
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const start = format(dates.start);
    const end = format(dates.end);
    
    const details = `Course: ${course.title}\nCategory: ${course.category}\nInstructor: ${course.instructor.map(i => i.name).join(', ')}`;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(course.title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(course.location)}&sf=true&output=xml`;
};

export const downloadIcs = (course: Course) => {
    const dates = getEventDateTime(course.date, course.time);
    if (!dates) return;
    
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const start = format(dates.start);
    const end = format(dates.end);
    const now = format(new Date());

    const content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//PMAT//Course Management System//EN',
        'BEGIN:VEVENT',
        `UID:${course.id}-${Date.now()}@pmat.or.th`,
        `DTSTAMP:${now}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${course.title}`,
        `DESCRIPTION:${course.type} - ${course.category}\\nInstructor: ${course.instructor.map(i => i.name).join(', ')}`,
        `LOCATION:${course.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${course.title.replace(/[^a-z0-9]/gi, '_').substring(0, 20)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};