
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Teacher, Observation, ProfessionalGrowthMeeting } from './types';
import * as db from './services/db';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NewObservation from './components/NewObservation';
import ObservationsList from './components/ObservationsList';
import TeachersList from './components/TeachersList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Toast from './components/common/Toast';
import TeacherProfile from './components/TeacherProfile';
import NewMeeting from './components/NewMeeting';
import LaunchScreen from './components/LaunchScreen';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('dashboard');
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [observations, setObservations] = useState<Observation[]>([]);
    const [meetings, setMeetings] = useState<ProfessionalGrowthMeeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [editingObservationId, setEditingObservationId] = useState<number | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);


    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            await db.initDB();
            const [fetchedTeachers, fetchedObservations, fetchedMeetings] = await Promise.all([
                db.getAllTeachers(),
                db.getAllObservations(),
                db.getAllMeetings()
            ]);
            setTeachers(fetchedTeachers.sort((a, b) => a.name.localeCompare(b.name)));
            setObservations(fetchedObservations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setMeetings(fetchedMeetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            console.error("Failed to load data:", error);
            showToast("Failed to load data from the database.", 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
        refreshData();
    }, [refreshData]);

    const handleNavigate = (targetPage: Page) => {
        setSelectedTeacherId(null);
        setEditingObservationId(null);
        setPage(targetPage);
    }

    const handleEditObservation = (id: number) => {
        setEditingObservationId(id);
        setPage('new_observation');
    };
    
    const handleNewObservation = () => {
        setEditingObservationId(null);
        setPage('new_observation');
    }

    const handleNewMeeting = () => {
        setSelectedTeacherId(null);
        setEditingObservationId(null);
        setPage('new_meeting');
    }

    const handleSelectTeacher = (teacherId: number) => {
        setSelectedTeacherId(teacherId);
        setPage('teacher_profile');
    }

    const renderPage = () => {
        const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

        switch (page) {
            case 'dashboard':
                return <Dashboard observations={observations} teachers={teachers} />;
            case 'new_observation':
                return <NewObservation 
                    teachers={teachers} 
                    onSave={() => { refreshData(); handleNavigate('observations'); }} 
                    showToast={showToast}
                    observationId={editingObservationId}
                />;
            case 'observations':
                return <ObservationsList observations={observations} teachers={teachers} onEdit={handleEditObservation} refreshData={refreshData} showToast={showToast}/>;
            case 'teachers':
                return <TeachersList teachers={teachers} observations={observations} refreshData={refreshData} showToast={showToast} onSelectTeacher={handleSelectTeacher} />;
            case 'teacher_profile':
                if (selectedTeacher) {
                    return <TeacherProfile 
                                teacher={selectedTeacher}
                                observations={observations.filter(o => o.teacherId === selectedTeacher.id)}
                                meetings={meetings.filter(m => m.teacherId === selectedTeacher.id)}
                                onBack={() => handleNavigate('teachers')}
                                onStartNewMeeting={() => setPage('new_meeting')}
                           />
                }
                return <div>Teacher not found.</div>
            case 'new_meeting':
                 return <NewMeeting
                    teachers={teachers}
                    teacherId={selectedTeacherId}
                    onSave={() => {
                        refreshData();
                        if (selectedTeacherId) {
                            setPage('teacher_profile');
                        } else {
                            handleNavigate('teachers');
                        }
                    }}
                    onCancel={() => {
                        if (selectedTeacherId) {
                            setPage('teacher_profile');
                        } else {
                            handleNavigate('dashboard');
                        }
                    }}
                    showToast={showToast}
                />
            case 'reports':
                return <Reports observations={observations} teachers={teachers} />;
            case 'settings':
                 return <Settings refreshData={refreshData} showToast={showToast} />;
            default:
                return <Dashboard observations={observations} teachers={teachers} />;
        }
    };
    
    if (loading) {
      return <LaunchScreen />;
    }

    return (
        <>
            <Layout page={page} setPage={handleNavigate} onNewObservation={handleNewObservation} onNewMeeting={handleNewMeeting}>
                {renderPage()}
            </Layout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default App;