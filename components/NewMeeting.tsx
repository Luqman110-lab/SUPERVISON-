
import React, { useState, useMemo } from 'react';
import { Teacher, ProfessionalGrowthMeeting, MeetingArea, ActionItem } from '../types';
import { PROFESSIONAL_MEETING_FRAMEWORK } from '../constants';
import * as db from '../services/db';
import { v4 as uuidv4 } from 'uuid';

interface NewMeetingProps {
    teachers: Teacher[];
    teacherId?: number | null;
    onSave: () => void;
    onCancel: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const NewMeeting: React.FC<NewMeetingProps> = ({ teachers, teacherId, onSave, onCancel, showToast }) => {
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [internalTeacherId, setInternalTeacherId] = useState<string>(teacherId ? String(teacherId) : '');
    const [areas, setAreas] = useState<MeetingArea[]>(
        PROFESSIONAL_MEETING_FRAMEWORK.map(area => ({
            id: area.id,
            name: area.name,
            notes: '',
        }))
    );
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);

    const preselectedTeacher = useMemo(() => teachers.find(t => t.id === teacherId), [teachers, teacherId]);

    const handleNotesChange = (areaId: string, notes: string) => {
        setAreas(prevAreas => 
            prevAreas.map(area => area.id === areaId ? { ...area, notes } : area)
        );
    };

    const handleActionItemChange = (itemId: string, field: keyof ActionItem, value: string) => {
        setActionItems(prevItems => 
            prevItems.map(item => item.id === itemId ? { ...item, [field]: value } : item)
        );
    };

    const addActionItem = () => {
        const newItem: ActionItem = {
            id: uuidv4(),
            description: '',
            status: 'To Do',
            dueDate: '',
        };
        setActionItems(prev => [...prev, newItem]);
    };

    const removeActionItem = (itemId: string) => {
        setActionItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalTeacherId = teacherId || parseInt(internalTeacherId, 10);
        if (!finalTeacherId) {
            showToast('Please select a teacher.', 'error');
            return;
        }

        const teacher = teachers.find(t => t.id === finalTeacherId);
        if (!teacher) {
            showToast('Selected teacher not found.', 'error');
            return;
        }

        const finalActionItems = actionItems.filter(item => item.description.trim() !== '');

        const newMeeting: ProfessionalGrowthMeeting = {
            teacherId: teacher.id!,
            teacherName: teacher.name,
            date,
            areas: areas.filter(area => area.notes.trim() !== ''),
            actionItems: finalActionItems,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await db.addMeeting(newMeeting);
            showToast('Meeting saved successfully!', 'success');
            onSave();
        } catch (error) {
            console.error('Failed to save meeting:', error);
            showToast('Failed to save meeting.', 'error');
        }
    };
    

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
             <div>
                <button type="button" onClick={onCancel} className="text-primary hover:underline mb-4">&larr; Back</button>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">New Professional Growth Meeting</h2>
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
                         {preselectedTeacher ? (
                            <div className="p-2 border rounded bg-gray-100 w-full md:w-1/2">
                                <span className="text-gray-500 text-sm">Teacher</span>
                                <p className="font-semibold text-lg">{preselectedTeacher.name}</p>
                            </div>
                        ) : (
                            <select 
                                value={internalTeacherId} 
                                onChange={e => setInternalTeacherId(e.target.value)} 
                                className="p-2 border rounded w-full md:w-1/2" 
                                required
                            >
                                <option value="">-- Select a Teacher --</option>
                                {teachers.map(t => <option key={t.id!} value={t.id}>{t.name}</option>)}
                            </select>
                        )}
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded w-full md:w-auto" required />
                    </div>
                </div>
            </div>

            {PROFESSIONAL_MEETING_FRAMEWORK.map((frameworkArea, index) => (
                <div key={frameworkArea.id} className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">{frameworkArea.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Guiding Questions:</p>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                        {frameworkArea.guidingQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                     <textarea 
                        value={areas[index].notes}
                        onChange={(e) => handleNotesChange(frameworkArea.id, e.target.value)}
                        placeholder="Meeting notes for this area..."
                        className="w-full p-2 border rounded min-h-[120px]"
                    ></textarea>
                </div>
            ))}
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Action Items</h3>
                <div className="space-y-4">
                    {actionItems.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border rounded-lg">
                            <input 
                                type="text" 
                                value={item.description}
                                onChange={e => handleActionItemChange(item.id, 'description', e.target.value)}
                                placeholder={`Action Item ${index + 1}`}
                                className="w-full p-2 border rounded md:col-span-6"
                            />
                             <select 
                                value={item.status}
                                onChange={e => handleActionItemChange(item.id, 'status', e.target.value)}
                                className="w-full p-2 border rounded md:col-span-3"
                            >
                                <option>To Do</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                             <input 
                                type="date"
                                value={item.dueDate || ''}
                                onChange={e => handleActionItemChange(item.id, 'dueDate', e.target.value)}
                                className="w-full p-2 border rounded md:col-span-2"
                            />
                            <button type="button" onClick={() => removeActionItem(item.id)} className="text-danger hover:bg-red-50 p-2 rounded-full md:col-span-1 flex items-center justify-center">
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addActionItem} className="mt-4 text-primary font-semibold hover:underline">
                    + Add Action Item
                </button>
            </div>
            
            <div className="flex justify-end items-center space-x-4 sticky bottom-20 md:bottom-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-dark transition-colors">
                    Save Meeting
                </button>
            </div>
        </form>
    );
};

export default NewMeeting;
