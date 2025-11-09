
import React, { useState, useEffect, useMemo } from 'react';
import { Observation, Teacher, Domain, Competency, PerformanceLevel } from '../types';
import { OBSERVATION_FRAMEWORK, RATING_SCALE, getPerformanceLevel } from '../constants';
import * as db from '../services/db';
import cloneDeep from 'lodash/cloneDeep';

interface NewObservationProps {
    teachers: Teacher[];
    onSave: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
    observationId: number | null;
}

const NewObservation: React.FC<NewObservationProps> = ({ teachers, onSave, showToast, observationId }) => {
    const [observation, setObservation] = useState<Partial<Observation>>({});
    const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const initialFormState = useMemo(() => ({
        observerName: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        teacherId: undefined,
        className: '',
        subjectTopic: '',
        lessonType: '',
        domains: cloneDeep(OBSERVATION_FRAMEWORK),
        keyStrengths: '',
        areasForDevelopment: '',
        commendations: '',
        recommendations: '',
        followUpDate: '',
        supportNeeded: '',
    }), []);
    
    useEffect(() => {
        const loadObservation = async () => {
            if(observationId){
                setLoading(true);
                const existingObs = await db.getObservation(observationId);
                if(existingObs){
                    setObservation(existingObs);
                } else {
                    showToast('Observation not found', 'error');
                    setObservation(initialFormState);
                }
                setLoading(false);
            } else {
                const draft = localStorage.getItem('observationDraft');
                setObservation(draft ? JSON.parse(draft) : initialFormState);
                setLoading(false);
            }
        };
        loadObservation();
    }, [observationId, showToast, initialFormState]);


    useEffect(() => {
        if (!observationId) { // Only save draft for new observations
             localStorage.setItem('observationDraft', JSON.stringify(observation));
        }
    }, [observation, observationId]);
    
    const { overallScore, performanceLevel, progress } = useMemo(() => {
        if (!observation.domains) return { overallScore: 0, performanceLevel: PerformanceLevel.Unrated, progress: 0 };

        let ratedCompetenciesCount = 0;
        let totalCompetencies = 0;
        
        const domainScores = observation.domains.map(domain => {
            const ratedCompetencies = domain.competencies.filter(c => c.rating > 0);
            totalCompetencies += domain.competencies.length;
            ratedCompetenciesCount += domain.competencies.filter(c => c.rating !== 0).length;

            if (ratedCompetencies.length === 0) return 0;
            const domainSum = ratedCompetencies.reduce((acc, c) => acc + c.rating, 0);
            return domainSum / ratedCompetencies.length;
        });

        const validDomainScores = domainScores.filter(score => score > 0);
        const overallScore = validDomainScores.length > 0
            ? validDomainScores.reduce((acc, score) => acc + score, 0) / validDomainScores.length
            : 0;

        const performanceLevel = getPerformanceLevel(overallScore);
        const progress = totalCompetencies > 0 ? (ratedCompetenciesCount / totalCompetencies) * 100 : 0;

        return { overallScore, performanceLevel, progress };
    }, [observation.domains]);


    const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setObservation({ ...observation, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (domainIndex: number, competencyIndex: number, rating: number) => {
        const newDomains = cloneDeep(observation.domains!);
        newDomains[domainIndex].competencies[competencyIndex].rating = rating;
        setObservation({ ...observation, domains: newDomains });
    };

    const handleEvidenceChange = (domainIndex: number, competencyIndex: number, evidence: string) => {
        const newDomains = cloneDeep(observation.domains!);
        newDomains[domainIndex].competencies[competencyIndex].evidence = evidence;
        setObservation({ ...observation, domains: newDomains });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!observation.teacherId || !observation.className || !observation.subjectTopic) {
            showToast('Please fill all required basic information fields.', 'error');
            return;
        }

        const teacher = teachers.find(t => t.id === Number(observation.teacherId));
        if (!teacher) {
            showToast('Selected teacher not found.', 'error');
            return;
        }
        
        const finalObservation: Observation = {
            ...initialFormState,
            ...observation,
            teacherId: Number(observation.teacherId),
            teacherName: teacher.name,
            overallScore,
            performanceLevel,
            createdAt: observation.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Observation;

        try {
            if(observationId){
                finalObservation.id = observationId;
                await db.updateObservation(finalObservation);
                showToast('Observation updated successfully!', 'success');
            } else {
                 await db.addObservation(finalObservation);
                 showToast('Observation saved successfully!', 'success');
                 localStorage.removeItem('observationDraft');
            }
            onSave();
        } catch (error) {
            console.error('Failed to save observation:', error);
            showToast('Failed to save observation.', 'error');
        }
    };
    
    if (loading) return <div>Loading observation...</div>;
    if (!observation.domains) return <div>Initializing form...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{observationId ? 'Edit Observation' : 'New Observation'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" name="observerName" value={observation.observerName || ''} onChange={handleBasicInfoChange} placeholder="Observer Name" className="p-2 border rounded" required />
                    <input type="date" name="date" value={observation.date || ''} onChange={handleBasicInfoChange} className="p-2 border rounded" required />
                    <input type="time" name="time" value={observation.time || ''} onChange={handleBasicInfoChange} className="p-2 border rounded" required />
                    <select name="teacherId" value={observation.teacherId || ''} onChange={handleBasicInfoChange} className="p-2 border rounded" required>
                        <option value="">Select Teacher</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input type="text" name="className" value={observation.className || ''} onChange={handleBasicInfoChange} placeholder="Class" className="p-2 border rounded" required />
                    <input type="text" name="subjectTopic" value={observation.subjectTopic || ''} onChange={handleBasicInfoChange} placeholder="Subject/Topic" className="p-2 border rounded" required />
                    <input type="text" name="lessonType" value={observation.lessonType || ''} onChange={handleBasicInfoChange} placeholder="Lesson Type" className="p-2 border rounded" />
                </div>
            </div>

            <div className="sticky top-[70px] bg-white p-4 rounded-xl shadow-md z-10">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Observation Progress</h3>
                    <div className="text-right">
                         <p className="font-bold text-lg">{performanceLevel}</p>
                         <p className="text-sm text-gray-600">Overall Score: {overallScore.toFixed(2)}</p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right text-sm mt-1 text-gray-600">{Math.round(progress)}% Complete</div>
            </div>
            
             <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto">
                        {observation.domains.map((domain, index) => (
                            <button key={domain.id} type="button" onClick={() => setCurrentDomainIndex(index)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${currentDomainIndex === index ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                {`D${index + 1}: ${domain.name}`}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    {observation.domains.map((domain, dIndex) => (
                        <div key={domain.id} className={currentDomainIndex === dIndex ? 'block' : 'hidden'}>
                            <h3 className="text-xl font-bold text-gray-700 mb-4">{domain.name}</h3>
                            <div className="space-y-6">
                                {domain.competencies.map((comp, cIndex) => (
                                    <div key={comp.id} className="border-t pt-4">
                                        <h4 className="font-semibold text-lg">{comp.title}</h4>
                                        <ul className="list-disc list-inside text-gray-600 my-2">
                                            {comp.indicators.map((ind, i) => <li key={i}>{ind}</li>)}
                                        </ul>
                                        <div className="flex flex-wrap gap-2 my-3">
                                            {RATING_SCALE.map(r => (
                                                <button type="button" key={r.value} onClick={() => handleRatingChange(dIndex, cIndex, r.value)}
                                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-transform transform hover:scale-105 ${comp.rating === r.value ? `${r.color} text-white` : 'bg-gray-200 text-gray-700'}`}>
                                                    {r.value === 0 ? r.label : `${r.value} - ${r.label}`}
                                                </button>
                                            ))}
                                        </div>
                                        <textarea value={comp.evidence} onChange={(e) => handleEvidenceChange(dIndex, cIndex, e.target.value)}
                                            placeholder="Evidence notes..."
                                            className="w-full p-2 border rounded mt-2 min-h-[80px]"></textarea>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <textarea name="keyStrengths" value={observation.keyStrengths || ''} onChange={handleBasicInfoChange} placeholder="Key Strengths" className="p-2 border rounded min-h-[100px]"></textarea>
                     <textarea name="areasForDevelopment" value={observation.areasForDevelopment || ''} onChange={handleBasicInfoChange} placeholder="Areas for Development" className="p-2 border rounded min-h-[100px]"></textarea>
                     <textarea name="commendations" value={observation.commendations || ''} onChange={handleBasicInfoChange} placeholder="Commendations" className="p-2 border rounded min-h-[100px]"></textarea>
                     <textarea name="recommendations" value={observation.recommendations || ''} onChange={handleBasicInfoChange} placeholder="Recommendations" className="p-2 border rounded min-h-[100px]"></textarea>
                     <div className="form-control">
                        <label htmlFor="followUpDate" className="text-sm text-gray-600">Follow-up Date</label>
                        <input id="followUpDate" type="date" name="followUpDate" value={observation.followUpDate || ''} onChange={handleBasicInfoChange} className="w-full p-2 border rounded" />
                     </div>
                     <input type="text" name="supportNeeded" value={observation.supportNeeded || ''} onChange={handleBasicInfoChange} placeholder="Support Needed" className="p-2 border rounded" />
                </div>
             </div>

            <div className="flex justify-end sticky bottom-20 md:bottom-4">
                <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-dark transition-colors">
                    {observationId ? 'Update Observation' : 'Save Observation'}
                </button>
            </div>
        </form>
    );
};

export default NewObservation;