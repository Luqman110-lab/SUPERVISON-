
import React, { useState, useMemo } from 'react';
import { Observation, Teacher, PerformanceLevel } from '../types';
import { OBSERVATION_FRAMEWORK, getPerformanceLevel } from '../constants';
import PerformanceBadge from './common/PerformanceBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { exportDataToCSV } from '../services/csvGenerator';
import { generateTeacherSummaryPDF } from '../services/pdfGenerator';


const Reports: React.FC<{ observations: Observation[]; teachers: Teacher[] }> = ({ observations, teachers }) => {
    const [activeTab, setActiveTab] = useState('school-wide');
    
    const schoolWideData = useMemo(() => {
        const avgScore = observations.length > 0 ? observations.reduce((acc, obs) => acc + obs.overallScore, 0) / observations.length : 0;
        const distribution = Object.values(PerformanceLevel).map(level => ({
            level,
            count: observations.filter(obs => obs.performanceLevel === level).length
        }));
        return { avgScore, distribution };
    }, [observations]);

    const teacherComparisonData = useMemo(() => {
        return teachers.map(teacher => {
            const teacherObs = observations.filter(obs => obs.teacherId === teacher.id);
            const obsCount = teacherObs.length;
            const avgScore = obsCount > 0 ? teacherObs.reduce((acc, obs) => acc + obs.overallScore, 0) / obsCount : 0;
            return {
                id: teacher.id,
                name: teacher.name,
                obsCount,
                avgScore,
                performanceLevel: getPerformanceLevel(avgScore)
            };
        }).sort((a, b) => b.avgScore - a.avgScore);
    }, [teachers, observations]);

    const domainAnalysisData = useMemo(() => {
        return OBSERVATION_FRAMEWORK.map(domain => {
            const scores: number[] = [];
            observations.forEach(obs => {
                const obsDomain = obs.domains.find(d => d.id === domain.id);
                if (obsDomain) {
                    const ratedComps = obsDomain.competencies.filter(c => c.rating > 0);
                    if (ratedComps.length > 0) {
                        const domainScore = ratedComps.reduce((acc, c) => acc + c.rating, 0) / ratedComps.length;
                        scores.push(domainScore);
                    }
                }
            });
            const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            return { name: domain.name, avgScore };
        }).sort((a, b) => b.avgScore - a.avgScore);
    }, [observations]);

    const handleExportCSV = () => {
        exportDataToCSV(observations, teachers);
    };

    const handleGenerateTeacherPDF = (teacherId: number) => {
        const teacher = teachers.find(t => t.id === teacherId);
        const teacherObs = observations.filter(o => o.teacherId === teacherId);
        if(teacher && teacherObs.length > 0) {
            generateTeacherSummaryPDF(teacher, teacherObs);
        }
    };
    
    const COLORS: { [key in PerformanceLevel]: string } = {
      [PerformanceLevel.Exemplary]: '#10b981',
      [PerformanceLevel.Proficient]: '#1e40af',
      [PerformanceLevel.Developing]: '#f59e0b',
      [PerformanceLevel.Intervention]: '#dc2626',
      [PerformanceLevel.Unrated]: '#9ca3af',
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'school-wide':
                return (
                    <div className="space-y-4">
                        <p className="text-lg">School Average Score: <span className="font-bold">{schoolWideData.avgScore.toFixed(2)}</span></p>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={schoolWideData.distribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="level" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="Observations">
                                        {schoolWideData.distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.level]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'teacher-comparison':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="w-full bg-gray-100 text-left text-gray-600 uppercase text-sm">
                                    <th className="py-3 px-4">Rank</th><th className="py-3 px-4">Teacher</th><th className="py-3 px-4">Observations</th><th className="py-3 px-4">Avg Score</th><th className="py-3 px-4">Level</th><th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {teacherComparisonData.map((t, index) => (
                                    <tr key={t.id} className="border-b border-gray-200">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{t.name}</td>
                                        <td className="py-3 px-4">{t.obsCount}</td>
                                        <td className="py-3 px-4">{t.avgScore.toFixed(2)}</td>
                                        <td className="py-3 px-4"><PerformanceBadge level={t.performanceLevel} /></td>
                                        <td className="py-3 px-4"><button onClick={() => handleGenerateTeacherPDF(t.id!)} className="text-primary hover:underline text-sm">PDF</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'domain-analysis':
                 return (
                    <div className="space-y-3">
                        {domainAnalysisData.map(d => (
                            <div key={d.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-700">{d.name}</span>
                                    <span className="font-bold text-primary-dark">{d.avgScore.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div className="bg-primary-light h-4 rounded-full" style={{ width: `${(d.avgScore/4)*100}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default: return null;
        }
    };
    
    const tabs = [
        { id: 'school-wide', label: 'School-Wide' },
        { id: 'teacher-comparison', label: 'Teacher Comparison' },
        { id: 'domain-analysis', label: 'Domain Analysis' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
                <button onClick={handleExportCSV} className="bg-success text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-emerald-600 transition-colors">Export to CSV</button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab.label}</button>
                        ))}
                    </nav>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default Reports;