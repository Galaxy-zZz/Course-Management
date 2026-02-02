export interface Instructor {
    name: string;
    image: string;
}

export interface Registration {
    name: string;
    email: string;
    phone: string;
    organization: string;
    status: 'Pending' | 'Success' | 'Canceled';
    remark: string;
    isMember?: boolean;
}

export interface TrainingSession {
    no: number;
    thaiDate: string;
    sortStartDate: string;
    sortEndDate: string;
    minParticipants: number;
    maxParticipants: number;
    currentParticipants: number;
    generalPrice: string;
    subscriptionPrice: string;
    accessType?: 'system' | 'external';
    externalUrl?: string;
    meetingUrl: string;
}

export interface Course {
    id: number;
    itemCode?: string;
    title: string;
    titleEn?: string;
    category: string;
    type: string;
    format: 'Onsite' | 'Online' | 'Online on ZOOM' | 'Onsite at Hotel';
    date: string;
    time: string;
    location: string;
    instructor: Instructor[];
    priceMember: string;
    priceNormal: string;
    status: 'เปิดรับสมัคร' | 'เลื่อน' | 'เต็ม' | 'ยกเลิก' | 'จัดไปแล้ว';
    image: string;
    past: boolean;
    description?: string;
    descriptionEn?: string;
    outlineUrl?: string;
    publish?: boolean;
    onlySubscription?: boolean;
    sessions?: TrainingSession[];
    registrations?: Registration[];
    owner?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'date-asc' | 'date-desc' | 'popular';