import React, { useState, useMemo } from 'react';
import { Teacher, Observation, ProfessionalGrowthMeeting, ActionItem } from '../types';
import PerformanceBadge from './common/PerformanceBadge';

interface TeacherProfileProps {
    teacher: Teacher;
    observations: Observation[];
    meetings: ProfessionalGrowthMeeting[];
    onBack: () => void;
    onStartNewMeeting: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; bgColor: string; icon: React.ReactNode }> = ({ title, value, bgColor, icon }) => (
    <div className={`p-4 rounded-xl shadow-md flex items-center space-x-4 text-white ${bgColor}`}>
        <div className="p-2 bg-white bg-opacity-20 rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);


const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, observations, meetings, onBack, onStartNewMeeting }) => {
    const [activeTab, setActiveTab] = useState<'observations' | 'growth'>('observations');

    const allActionItems = useMemo(() => {
        return meetings.flatMap(m => m.actionItems.map(item => ({...item, meetingDate: m.date})) );
    }, [meetings]);

    const actionItemStats = useMemo(() => ({
        todo: allActionItems.filter(a => a.status === 'To Do').length,
        inProgress: allActionItems.filter(a => a.status === 'In Progress').length,
        completed: allActionItems.filter(a => a.status === 'Completed').length,
    }), [allActionItems]);

    const outstandingItems = allActionItems.filter(item => item.status !== 'Completed');
    const completedItems = allActionItems.filter(item => item.status === 'Completed');

    return (
        <div className="space-y-6">
            <div>
                <button onClick={onBack} className="text-primary hover:underline mb-4">&larr; Back to all teachers</button>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
                    <p className="text-gray-500">Classes: {teacher.classes} | Subjects: {teacher.subjects}</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Action Item Scoreboard</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard title="To Do" value={actionItemStats.todo} bgColor="bg-warning" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>} />
                    <StatCard title="In Progress" value={actionItemStats.inProgress} bgColor="bg-primary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <StatCard title="Completed" value={actionItemStats.completed} bgColor="bg-success" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                </div>
            </div>

            {allActionItems.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Action Item Details</h2>
                    <div className="space-y-4">
                         <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Outstanding Items ({outstandingItems.length})</h3>
                            <div className="space-y-2">
                                {outstandingItems.length > 0 ? outstandingItems.map(item => (
                                    <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
                                        <p className="font-medium text-gray-800">{item.description}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-500 mt-1">
                                            <span>Status: <span className="font-semibold text-blue-600">{item.status}</span></span>
                                            {item.dueDate && <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>}
                                            <span>From Meeting: {new Date(item.meetingDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 italic">No outstanding action items.</p>}
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Items ({completedItems.length})</h3>
                            <div className="space-y-2">
                               {completedItems.length > 0 ? completedItems.map(item => (
                                    <div key={item.id} className="p-3 border rounded-lg bg-green-50 text-gray-500">
                                        <p className="line-through">{item.description}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 text-sm mt-1">
                                            <span>Status: <span className="font-semibold text-green-600">{item.status}</span></span>
                                            <span>From Meeting: {new Date(item.meetingDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 italic">No completed action items yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        <button onClick={() => setActiveTab('observations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'observations' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Classroom Observations ({observations.length})
                        </button>
                        <button onClick={() => setActiveTab('growth')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'growth' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Professional Growth ({meetings.length})
                        </button>
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'observations' && (
                        <div className="space-y-4">
                            {observations.length > 0 ? observations.map(obs => (
                                <div key={obs.id} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-lg text-primary-dark">{obs.subjectTopic}</p>
                                            <p className="text-sm text-gray-500">{new Date(obs.date).toLocaleDateString()}</p>
                                        </div>
                                        <PerformanceBadge level={obs.performanceLevel} score={obs.overallScore} />
                                    </div>
                                </div>
                            )) : <p className="text-gray-500">No observations recorded for this teacher yet.</p>}
                        </div>
                    )}
                     {activeTab === 'growth' && (
                        <div>
                             <button onClick={onStartNewMeeting} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-primary-dark transition-colors mb-6">
                                Start New Professional Growth Meeting
                            </button>
                            <div className="space-y-4">
                               {meetings.length > 0 ? meetings.map(meeting => (
                                    <div key={meeting.id} className="p-4 border rounded-lg">
                                        <p className="font-bold text-lg text-primary-dark">Meeting on {new Date(meeting.date).toLocaleDateString()}</p>
                                        <div className="mt-2">
                                            <h4 className="font-semibold">Action Items ({meeting.actionItems.length})</h4>
                                            {meeting.actionItems.length > 0 ? (
                                                <ul className="list-disc pl-5 text-sm text-gray-600">
                                                    {meeting.actionItems.map(item => (
                                                        <li key={item.id}>
                                                            {item.description} - <span className="font-semibold">{item.status}</span>
                                                            {item.dueDate && <span> (Due: {new Date(item.dueDate).toLocaleDateString()})</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-sm text-gray-500 italic">No action items from this meeting.</p>}
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 text-center">No professional growth meetings recorded yet.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
