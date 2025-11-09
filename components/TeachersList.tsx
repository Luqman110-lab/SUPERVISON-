
import React, { useState, useMemo } from 'react';
import { Teacher, Observation, PerformanceLevel } from '../types';
import * as db from '../services/db';
import PerformanceBadge from './common/PerformanceBadge';
import { getPerformanceLevel } from '../constants';

const AddTeacherModal: React.FC<{ onClose: () => void; onSave: () => void; showToast: (msg: string, type: 'success' | 'error') => void; }> = ({ onClose, onSave, showToast }) => {
    const [name, setName] = useState('');
    const [classes, setClasses] = useState('');
    const [subjects, setSubjects] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            showToast('Teacher name is required.', 'error');
            return;
        }
        const newTeacher: Teacher = {
            name: name.trim(),
            classes: classes.trim(),
            subjects: subjects.trim(),
            createdAt: new Date().toISOString(),
        };
        try {
            await db.addTeacher(newTeacher);
            showToast('Teacher added successfully!', 'success');
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            showToast('Failed to add teacher. Name might already exist.', 'error');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary-dark">Add New Teacher</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Teacher's Full Name" className="w-full p-2 border rounded" required />
                    <input type="text" value={classes} onChange={e => setClasses(e.target.value)} placeholder="Classes Taught (e.g., P1, P2)" className="w-full p-2 border rounded" />
                    <input type="text" value={subjects} onChange={e => setSubjects(e.target.value)} placeholder="Subjects (e.g., Math, Science)" className="w-full p-2 border rounded" />
                     <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Save Teacher</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface TeachersListProps {
    teachers: Teacher[];
    observations: Observation[];
    refreshData: () => void;
    showToast: (msg: string, type: 'success' | 'error') => void;
    onSelectTeacher: (teacherId: number) => void;
}


const TeachersList: React.FC<TeachersListProps> = ({ teachers, observations, refreshData, showToast, onSelectTeacher }) => {
    const [showAddModal, setShowAddModal] = useState(false);

    const teacherStats = useMemo(() => {
        return teachers.map(teacher => {
            const teacherObs = observations.filter(obs => obs.teacherId === teacher.id);
            const obsCount = teacherObs.length;
            const avgScore = obsCount > 0 
                ? teacherObs.reduce((acc, obs) => acc + obs.overallScore, 0) / obsCount
                : 0;
            const performanceLevel = getPerformanceLevel(avgScore);
            return { ...teacher, obsCount, avgScore, performanceLevel };
        });
    }, [teachers, observations]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
                <button onClick={() => setShowAddModal(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-primary-dark transition-colors">
                    Add Teacher
                </button>
            </div>

            {teachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teacherStats.map(teacher => (
                        <div key={teacher.id} onClick={() => onSelectTeacher(teacher.id!)} className="bg-white p-6 rounded-xl shadow-md space-y-3 cursor-pointer hover:shadow-lg hover:border-primary border-2 border-transparent transition-all">
                            <h3 className="font-bold text-xl text-primary-dark">{teacher.name}</h3>
                            <p className="text-gray-600 text-sm">Classes: {teacher.classes || 'N/A'}</p>
                            <p className="text-gray-600 text-sm">Subjects: {teacher.subjects || 'N/A'}</p>
                            <div className="border-t pt-3 mt-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Observations</p>
                                    <p className="font-bold text-lg">{teacher.obsCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Avg. Score</p>
                                    <p className="font-bold text-lg">{teacher.avgScore.toFixed(2)}</p>
                                </div>
                                <PerformanceBadge level={teacher.performanceLevel} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">No teachers found</h2>
                    <p className="text-gray-500 mt-2">Add your first teacher to get started.</p>
                     <button onClick={() => setShowAddModal(true)} className="mt-6 bg-primary text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-primary-dark transition-colors">
                        Add Teacher
                    </button>
                </div>
            )}
            
            {showAddModal && <AddTeacherModal onClose={() => setShowAddModal(false)} onSave={refreshData} showToast={showToast} />}
        </div>
    );
};

export default TeachersList;