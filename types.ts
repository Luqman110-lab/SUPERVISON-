
export interface Competency {
  id: string;
  title: string;
  indicators: string[];
  rating: number; // 0 for N/A, 1-4 for scores
  evidence: string;
}

export interface Domain {
  id: string;
  name: string;
  competencies: Competency[];
}

export interface Observation {
  id?: number;
  observerName: string;
  date: string;
  time: string;
  teacherId: number;
  teacherName: string;
  className: string;
  subjectTopic: string;
  lessonType: string;
  domains: Domain[];
  overallScore: number;
  performanceLevel: PerformanceLevel;
  keyStrengths: string;
  areasForDevelopment: string;
  commendations: string;
  recommendations: string;
  followUpDate: string;
  supportNeeded: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id?: number;
  name: string;
  classes: string;
  subjects: string;
  createdAt: string;
}

export enum PerformanceLevel {
    Exemplary = 'Exemplary',
    Proficient = 'Proficient',
    Developing = 'Developing',
    Intervention = 'Needs Intervention',
    Unrated = 'Unrated'
}

export interface ActionItem {
    id: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Completed';
    dueDate?: string;
}

export interface MeetingArea {
    id: string;
    name: string;
    notes: string;
}

export interface ProfessionalGrowthMeeting {
    id?: number;
    teacherId: number;
    teacherName: string;
    date: string;
    areas: MeetingArea[];
    actionItems: ActionItem[];
    createdAt: string;
    updatedAt: string;
}


export type Page = 'dashboard' | 'new_observation' | 'observations' | 'teachers' | 'reports' | 'settings' | 'teacher_profile' | 'new_meeting';