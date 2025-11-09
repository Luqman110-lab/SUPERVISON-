
import React, { useState, useMemo } from 'react';
import { Observation, Teacher, PerformanceLevel } from '../types';
import PerformanceBadge from './common/PerformanceBadge';
import { generateObservationPDF } from '../services/pdfGenerator';
import * as db from '../services/db';


const ObservationDetailModal: React.FC<{ observation: Observation; onClose: () => void; onEdit: (id: number) => void; onDelete: (id: number) => void;}> = ({ observation, onClose, onEdit, onDelete }) => {
    
    const handleGeneratePDF = () => {
        generateObservationPDF(observation);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b sticky top-0 bg-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-primary-dark">{observation.teacherName}</h2>
                            <p className="text-gray-500">{observation.subjectTopic} on {new Date(observation.date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                    </div>
                     {/* FIX: This component now receives the correct `PerformanceLevel` type due to the change in `types.ts`. */}
                     <div className="mt-4"><PerformanceBadge level={observation.performanceLevel} score={observation.overallScore} /></div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Observer:</strong> {observation.observerName}</div>
                        <div><strong>Class:</strong> {observation.className}</div>
                        <div><strong>Time:</strong> {observation.time}</div>
                        <div><strong>Lesson Type:</strong> {observation.lessonType || 'N/A'}</div>
                    </div>
                     <div className="border-t pt-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Summary</h3>
                        <p className="mb-1"><strong>Key Strengths:</strong> {observation.keyStrengths || 'N/A'}</p>
                        <p className="mb-1"><strong>Areas for Development:</strong> {observation.areasForDevelopment || 'N/A'}</p>
                        <p className="mb-1"><strong>Commendations:</strong> {observation.commendations || 'N/A'}</p>
                        <p className="mb-1"><strong>Recommendations:</strong> {observation.recommendations || 'N/A'}</p>
                        <p className="mb-1"><strong>Support Needed:</strong> {observation.supportNeeded || 'N/A'}</p>
                        <p className="mb-1"><strong>Follow-up Date:</strong> {observation.followUpDate ? new Date(observation.followUpDate).toLocaleDateString() : 'N/A'}</p>
                     </div>
                    {observation.domains.map(domain => (
                        <div key={domain.id} className="border-t pt-4">
                            <h3 className="text-lg font-bold text-gray-800">{domain.name}</h3>
                            {domain.competencies.map(comp => (
                                <div key={comp.id} className="mt-2 pl-4 border-l-2">
                                    <p className="font-semibold">{comp.title} - <span className="font-normal">Rating: {comp.rating || 'N/A'}</span></p>
                                    {comp.evidence && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1"><em>Evidence:</em> {comp.evidence}</p>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t flex justify-end space-x-2 sticky bottom-0 bg-white">
                    <button onClick={() => onDelete(observation.id!)} className="bg-danger text-white px-4 py-2 rounded-lg">Delete</button>
                    <button onClick={() => onEdit(observation.id!)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Edit</button>
                    <button onClick={handleGeneratePDF} className="bg-primary text-white px-4 py-2 rounded-lg">Generate PDF</button>
                </div>
            </div>
        </div>
    );
};


const ObservationsList: React.FC<{ observations: Observation[], teachers: Teacher[], onEdit: (id: number) => void; refreshData: () => void; showToast: (msg: string, type: 'success'|'error') => void; }> = ({ observations, teachers, onEdit, refreshData, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTeacher, setFilterTeacher] = useState('');
    // FIX: Updated state to be of type PerformanceLevel or an empty string to match filter values.
    const [filterLevel, setFilterLevel] = useState<PerformanceLevel | ''>('');
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

    const filteredObservations = useMemo(() => {
        return observations.filter(obs => {
            const teacher = teachers.find(t => t.id === obs.teacherId);
            const searchMatch = searchTerm === '' || 
                (teacher && teacher.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                obs.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obs.subjectTopic.toLowerCase().includes(searchTerm.toLowerCase());
            
            const teacherMatch = filterTeacher === '' || obs.teacherId === parseInt(filterTeacher);
            // FIX: The comparison `obs.performanceLevel === filterLevel` is now type-correct.
            const levelMatch = filterLevel === '' || obs.performanceLevel === filterLevel;

            return searchMatch && teacherMatch && levelMatch;
        });
    }, [observations, teachers, searchTerm, filterTeacher, filterLevel]);
    
     const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this observation? This action cannot be undone.')) {
            try {
                await db.deleteObservation(id);
                showToast('Observation deleted.', 'success');
                setSelectedObservation(null);
                refreshData();
            } catch (e) {
                showToast('Failed to delete observation.', 'error');
            }
        }
    };


    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-800">All Observations</h1>

            <div className="bg-white p-4 rounded-xl shadow-md">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Search by teacher, class, subject..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border rounded w-full"/>
                    <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)} className="p-2 border rounded w-full">
                        <option value="">All Teachers</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                     {/* FIX: Cast value from onChange to `PerformanceLevel | ''` to match state type. */}
                     <select value={filterLevel} onChange={e => setFilterLevel(e.target.value as PerformanceLevel | '')} className="p-2 border rounded w-full">
                        <option value="">All Performance Levels</option>
                        {Object.values(PerformanceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredObservations.length > 0 ? filteredObservations.map(obs => (
                    <div key={obs.id} onClick={() => setSelectedObservation(obs)} className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:border-primary border-2 border-transparent transition-all">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl text-primary-dark mb-2">{obs.teacherName}</h3>
                            <PerformanceBadge level={obs.performanceLevel} score={obs.overallScore} />
                        </div>
                        <p className="text-gray-600">{obs.subjectTopic}</p>
                        <p className="text-sm text-gray-500 mt-2">{new Date(obs.date).toLocaleDateString()}</p>
                    </div>
                )) : <p className="text-gray-500 md:col-span-3">No observations match your criteria.</p>}
            </div>

            {selectedObservation && <ObservationDetailModal observation={selectedObservation} onClose={() => setSelectedObservation(null)} onEdit={onEdit} onDelete={handleDelete}/>}
        </div>
    );
};

export default ObservationsList;