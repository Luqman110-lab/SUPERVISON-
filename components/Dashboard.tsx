
import React, from 'react';
import { Observation, Teacher, PerformanceLevel } from '../types';
import { getPerformanceLevel, getPerformanceColor } from '../constants';
import PerformanceBadge from './common/PerformanceBadge';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
    observations: Observation[];
    teachers: Teacher[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className="bg-gray-100 rounded-full p-3 text-primary">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ observations, teachers }) => {
    const totalObservations = observations.length;
    const totalTeachers = teachers.length;
    const schoolAverageScore = totalObservations > 0 
        ? observations.reduce((acc, obs) => acc + obs.overallScore, 0) / totalObservations 
        : 0;

    const observationsThisMonth = observations.filter(obs => {
        const obsDate = new Date(obs.date);
        const today = new Date();
        return obsDate.getMonth() === today.getMonth() && obsDate.getFullYear() === today.getFullYear();
    }).length;

    // FIX: Cast Object.values(PerformanceLevel) to PerformanceLevel[] to ensure `level` is typed correctly.
    const performanceDistribution = (Object.values(PerformanceLevel) as PerformanceLevel[]).map(level => ({
        name: level,
        value: observations.filter(obs => obs.performanceLevel === level).length,
    }));
    
    const COLORS: { [key in PerformanceLevel]: string } = {
      [PerformanceLevel.Exemplary]: '#10b981',
      [PerformanceLevel.Proficient]: '#1e40af',
      [PerformanceLevel.Developing]: '#f59e0b',
      [PerformanceLevel.Intervention]: '#dc2626',
      [PerformanceLevel.Unrated]: '#9ca3af',
    };
    
    const recentObservations = observations.slice(0, 5);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Observations" value={totalObservations} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
                <StatCard title="Total Teachers" value={totalTeachers} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="School Average Score" value={schoolAverageScore.toFixed(2)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
                <StatCard title="Observations This Month" value={observationsThisMonth} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Observations</h2>
                    <div className="space-y-4">
                        {recentObservations.length > 0 ? recentObservations.map(obs => (
                             <div key={obs.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-primary-dark">{obs.teacherName}</p>
                                        <p className="text-sm text-gray-500">{obs.subjectTopic} - {new Date(obs.date).toLocaleDateString()}</p>
                                    </div>
                                    <PerformanceBadge level={obs.performanceLevel} score={obs.overallScore} />
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No observations recorded yet.</p>}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Distribution</h2>
                      <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                           <BarChart data={performanceDistribution.filter(p=>p.value > 0)} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" name="Observations">
                                    {performanceDistribution.map((entry, index) => (
                                        // FIX: Removed unnecessary cast as `entry.name` is now correctly typed as PerformanceLevel.
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                      </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;